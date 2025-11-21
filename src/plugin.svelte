<section id="windy-plugin-simbrief" class="plugin-section">
    <div class="title width-100">
        {#if currentState == PluginState.Ready && flightPlan != null}
            <div title={generateTitle()}>
                {flightPlan?.general.icao_airline + flightPlan?.general.flight_number }
            </div>
        {:else}
            <div>SimBrief Plugin</div>
        {/if}
        {#if currentState == PluginState.Ready && flightPlan != null}
            <div class="origin-destination" title={generateOriginDestinationTitle('origin')}>
                🛫 {flightPlan.origin.icao_code}
            </div>
            <div class="origin-destination" title={generateOriginDestinationTitle('destination')}>
                🛬 {flightPlan.destination.icao_code}
            </div>
        {/if}
        <div class="action-icons">
            {#if currentState == PluginState.Ready}
                <span class="reload-icon" title="Reload" on:click={() => loadData()}>🔄️</span>
            {/if}
            {#if currentState != PluginState.Settings}
                <span class="settings-icon" title="Settings" on:click={() => currentState = PluginState.Settings}>⚙️</span>
            {/if}
        </div>
    </div>
    {#if currentState == PluginState.Loading}
        <div class="plugin-loading width-100">
            <div>Loading...</div>
            <div class="loader"></div>
        </div>
    {:else if currentState == PluginState.Settings}
        <form on:submit|preventDefault={() => loadData()}>
            <table class="plugin-settings clear-both width-100">
                <tbody>
                    <tr>
                        <td>SimBrief Username:</td>
                        <td>
                            <input id="simbrief-username" type="text" placeholder="username (not ID)" bind:value={$simbriefUsernameStore}/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button type="submit" class="width-100"
                                bind:this={settingsSubmitButton}>💾 Save & Validate</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
        {#if error != null}
            <div class="error">Error: {error}</div>
        {/if}
    {:else if flightPlan != null}
        <div class="waypoint-table clear-both width-100">
            <table>
                <thead>
                    <tr>
                        <th class="ident">Waypoint</th>
                        <th class="time">Elapsed Time</th>
                        <th class="altitude">Altitude</th>
                    </tr>
                </thead>
                <tbody>
                    {#each markers as extMarker}
                        {@const { waypoint } = extMarker}
                        <tr
                            class="mb-20 size-s clickable {getClassName(waypoint)}"
                            on:click={() => displayPopup(extMarker, true)}
                        >
                            <td class="ident">{formatWaypointIdent(waypoint)}</td>
                            <td class="time" title="{formatWaypointTime(waypoint)}">{waypoint.time_total}</td>
                            <td class="altitude">{formatWaypointAltitude(waypoint)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>     
        </div>

    {/if}
</section>

<script lang="ts">
    import { map } from '@windy/map';
    import store from '@windy/store';
    import { CoordinatePoint, GreatCircle, LineString } from 'arc';
    import { onDestroy } from 'svelte';
    import { DateTime, Duration } from 'luxon';

    import type { ExtendedMarker, NavlogEntry } from './types';
    import { pointIcon, tocIcon, todIcon } from './pointIcon';
    import { NavlogFix, SimbriefPlan } from './simbrief.types';
    import { icaoToIata } from './airline';
    import { simbriefUsernameStore } from './stores/pluginStore';

    enum PluginState {
        Loading,
        Ready,
        Settings,
        Error
    }

    let error: string | null = null;
    let currentState: PluginState = PluginState.Loading;
    let flightPlan: SimbriefPlan | null;
    let markers: ExtendedMarker[] = [];
    let lines: L.Polyline[] = [];
    let openedPopup: L.Popup | null = null;
    let settingsSubmitButton: HTMLButtonElement | null = null;
    
    let currentSimbriefUsername: string | null = null;
    simbriefUsernameStore.subscribe(value => {
        currentSimbriefUsername = value;
    });

    const formatWaypointTime = (waypoint: NavlogEntry) => {
        if (flightPlan == null)
            return '';
        const offBlockTime = DateTime.fromISO(flightPlan.times.est_out).toUTC();;
        if (!offBlockTime.isValid)
            return '';
        const waypointTime = offBlockTime.plus(Duration.fromISOTime(waypoint.time_total));

        return `Elapsed time: ${waypoint.time_total}\r\n` + 
            `Date: ${waypointTime.toLocaleString(DateTime.DATE_MED)}\r\n` +
            `Time: ${waypointTime.toLocaleString(DateTime.TIME_SIMPLE)}Z`;
    }

    const formatWaypointIdent = (waypoint: NavlogEntry) => {
        const ident = waypoint.ident.toUpperCase();
        if (waypoint.type == 'ltlg')
            return waypoint.name;
        const via = waypoint.via_airway != 'DCT' ? ' via ' + waypoint.via_airway : '';
        const suffix = waypoint.type == 'vor' ? ' VOR' : '';
        return `${ident}${suffix}${via}`;
    }

    const formatWaypointAltitude = (waypoint: NavlogEntry) => {
        if (flightPlan == null)
            return `${waypoint.altitude_feet} ft`;

        const transitionAlt = parseInt(flightPlan.origin.trans_alt);
        const transitionLevel = parseInt(flightPlan.destination.trans_level);
        const altitude = parseInt(waypoint.altitude_feet);
        
        if ((waypoint.stage == 'CLB' && altitude < transitionAlt) || 
            (waypoint.stage == 'DSC' && altitude < transitionLevel)) {
            return `${altitude} ft`;
        }
        
        return `FL${altitude / 100}`;
    }

    const getClassName = (waypoint: NavlogEntry) => {
        if (waypoint.type == 'ltlg')
            return 'waypoint-pseudo';
        return 'waypoint';
    }
    
    const generateOriginDestinationTitle = (which: 'origin' | 'destination') => {
        if (flightPlan == null) 
            return '';
        const airport = which == 'origin' ? flightPlan.origin : flightPlan.destination;
        const prefix = which == 'origin' ? 'Departing from' : 'Arriving at';
        const timing = which == 'origin' ? flightPlan.times.est_out : flightPlan.times.est_in;
        return `${prefix} ${airport.icao_code} / ${airport.iata_code} (${airport.name})\r\n` + 
            `Time: ${formatTimeString(timing, airport.timezone)}`;        
    };

    const generateTitle = () => {
        if (flightPlan == null) 
            return '';
        const icaoFlightNumber = flightPlan?.general.icao_airline + flightPlan?.general.flight_number;
        const iataFlightNumber = icaoToIata(flightPlan.general.icao_airline) + flightPlan.general.flight_number;
        const callSign = flightPlan.atc.callsign != icaoFlightNumber ? ` (${flightPlan.atc.callsign})` : '';
        return `${iataFlightNumber} / ${icaoFlightNumber}${callSign}\r\n` + 
            `${flightPlan.origin.icao_code} to ${flightPlan.destination.icao_code}\r\n` +
            `Departure: ${formatTimeString(flightPlan.times.est_out, flightPlan.origin.timezone)}\r\n` + 
            `Arrival: ${formatTimeString(flightPlan.times.est_in, flightPlan.destination.timezone)}`;
    };

    const formatTimeString = (time: string, offset?: string) => {
        let dt = DateTime.fromISO(time, {setZone: true});
        if (offset != null && offset != '0') {
            if (offset.charAt(0) != '-')
                offset = `+${offset}`;
            dt = dt.setZone(`UTC${offset}`);
        }
        return offset == null ? 
            `${dt.toRelativeCalendar()} at ${dt.toUTC().toLocaleString(DateTime.TIME_SIMPLE)}Z` : 
            `${dt.toRelativeCalendar()} at ${dt.toLocaleString(DateTime.TIME_SIMPLE)} local time (${dt.toUTC().toLocaleString(DateTime.TIME_SIMPLE)}Z)`;
    };

    const displayPopup = (marker: ExtendedMarker, flyTo?: boolean) => {
        openedPopup?.remove();

        if (!marker) {
            throw new Error('Waypoint not found!');
        }

        let html = `<table class="popup-table"><tbody>
            <tr><th>Waypoint:</th><td>${marker.waypoint.ident.toUpperCase()}</td></tr>
            <tr><th>Altitude:</th><td>${marker.waypoint.altitude_feet} ft</td></tr>
            <tr><th>Type:</th><td>${marker.waypoint.type}</td></tr></tbody></table>`;

        openedPopup = new L.Popup({ autoClose: false, closeOnClick: false })
            .setLatLng(marker.marker._latlng)
            .setContent(html)
            .openOn(map);

        if (flyTo) {
            map.flyTo(marker.marker._latlng);
            store.set('level', convertAltitudeToNearestLevel(parseInt(marker.waypoint.altitude_feet)));
            setTimeIfInRange(marker.waypoint);
        }
    };

    const setTimeIfInRange = (waypoint: NavlogEntry) => {
        if (flightPlan == null)
            return;

        const takeoffTime = DateTime.fromISO(flightPlan.times.est_off);
        const waypointtime = takeoffTime.plus(Duration.fromISOTime(waypoint.time_total));
        
        if (waypointtime > DateTime.now())
            store.set('timestamp', waypointtime.valueOf());
        else
            store.set('timestamp', new Date().valueOf());
    }

    const convertAltitudeToNearestLevel = (altitudeInFt: number) => {
        if (altitudeInFt >= 42000)
            return '150h';
        else if (altitudeInFt >= 36500) 
            return '200h';
        else if (altitudeInFt >= 32000) 
            return '250h';
        else if (altitudeInFt >= 27000)
            return '300h';
        else if (altitudeInFt >= 21000)
            return '400h';
        else if (altitudeInFt >= 16000)
            return '500h';
        else if (altitudeInFt >= 12000)
            return '600h';
        else if (altitudeInFt >= 8000)
            return '700h';
        else if (altitudeInFt >= 5500)
            return '800h';
        else if (altitudeInFt >= 4000)
            return '850h';
        else if (altitudeInFt >= 1500)
            return '900h';
        else
            return 'surface';
    };

    const loadData = () => {
        if (currentSimbriefUsername == null) {
            currentState = PluginState.Settings;
        } else {
            disableSubmitButton();
            currentState = PluginState.Loading;
            fetch(`https://www.simbrief.com/api/xml.fetcher.php?username=${currentSimbriefUsername}&json=v2`)
                .then(response => response.json())
                .then((plan: SimbriefPlan) => {
                    flightPlan = plan;
                    const track: LineString = { 'type': 'LineString', coordinates: [] };
                    
                    if (plan.navlog.length < 2)
                        return;

                    let temporaryMarkers: ExtendedMarker[] = [];
                    let wpt = plan.navlog[0];
                    let from: CoordinatePoint = { x: parseFloat(wpt.pos_long), y: parseFloat(wpt.pos_lat) };
                    
                    temporaryMarkers.push(createMarker(wpt, from));
                    
                    for (let i = 1; i < plan.navlog.length; i++) {
                        wpt = plan.navlog[i];
                        const to: CoordinatePoint = { x: parseFloat(wpt.pos_long), y: parseFloat(wpt.pos_lat) };
                        temporaryMarkers.push(createMarker(wpt, to));

                        const fromR = { x: from.x * Math.PI / 180, y: from.y * Math.PI / 180 };
                        const toR = { x: to.x * Math.PI / 180, y: to.y * Math.PI / 180 };
                        const dX = toR.x - fromR.x;
                        const dY = toR.y - fromR.y;
                        const a = Math.pow(Math.sin(dX / 2), 2) + (Math.cos(fromR.x) * Math.cos(toR.x) * Math.pow(Math.sin(dY / 2), 2));
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        const segmentLength = c * 6371;
                        const numArcPoints = Math.ceil(segmentLength / 20);
                        
                        const gc = new GreatCircle(from, to);
                        const arc = gc.Arc(numArcPoints);
                        
                        track.coordinates.push(...arc.geometries.flatMap(geom => geom.coords.map(c => [c[1], c[0]])));
                        from = to;
                    }

                    const coords: [number, number][] = track.coordinates.map((entry, _index, _array) => [entry[0], entry[1]]);
                    const layer = new L.Polyline(coords, {
                        color: 'magenta',
                        weight: 4
                    }).addTo(map);

                    layer.on('mouseover', () => layer.setStyle({ weight: 6 }));
                    layer.on('mouseout', () => layer.setStyle({ weight: 4 }));

                    lines.push(layer);
                    markers = temporaryMarkers;

                    currentState = PluginState.Ready;
                    error = null;
                })
                .catch(() => {
                    currentState = PluginState.Settings;
                    error = 'Failed to load flight plan. Please check your SimBrief username.';

                    console.error(arguments);
                })
                .finally(() => {
                    enableSubmitButton();
                });
        }
    };

    const createMarker = (wpt: NavlogFix, point: CoordinatePoint) => {
        let icon = pointIcon;
        if (wpt.ident == "TOC")
            icon = tocIcon;
        if (wpt.ident == "TOD")
            icon = todIcon;
        
        let newMarker = {
            waypoint: wpt,
            marker: new L.Marker([point.y, point.x], {'title': wpt.ident, icon})
                .addTo(map)
                .bindTooltip(wpt.ident, {direction: 'top', opacity: 1, permanent: true, className: 'waypoint-tooltip'})
                .openTooltip()
        };
        newMarker.marker.on('click', () => {
            let that = newMarker;
            displayPopup(that);
        });
        return newMarker;
    };

    const disableSubmitButton = () => {
        if (settingsSubmitButton)
            settingsSubmitButton.disabled = true;
    };

    const enableSubmitButton = () => {
        if (settingsSubmitButton)
            settingsSubmitButton.disabled = false;
    };

    const removeAllMapFeatures = () => {
        openedPopup?.remove();
        markers.forEach(l => map.removeLayer(l.marker));
        lines.forEach(l => map.removeLayer(l));
        markers = [];
        lines = [];
    };

    export const onopen = () => {
        loadData();
    };

    onDestroy(() => {
        removeAllMapFeatures();
    });
</script>

<style lang="less">
    :global(#plugin-windy-plugin-simbrief) {
        padding: 5px 10px 5px 10px !important;
        height: 250px;
    }
    #simbrief-username {
        width: 160px;
        padding: 2px;
    }
    .error {
        color: red;
        padding-top: 10px;
    }
    .waypoint-pseudo {
        color: lightgray;
    }
    .clear-both {
        clear: both;
    }
    .width-100 {
        width: 100%;
    }
    .plugin-settings {
        width: 100%;
        height: 100%;;
    }
    .plugin-settings td {
        padding: 5px;
    }
    .title {
        padding: 0 0 5px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-size: medium;
        font-weight: bold;
        float: left;
    }
    .origin-destination {
        font-size: medium;
        font-weight: normal;
    }
    .action-icons {
        padding: 0 18px 0 0;
        float: right;
    }
    .action-icons span {
        cursor: pointer;
    }
    .reload-icon {
        margin-right: -5px;
    }
    .plugin-section {
        height: 100%;
        width: 100%;
    }
    .plugin-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 150px;
    }
    .plugin-loading div {
        padding: 10px;
    }
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    :global(.popup-table th) {
        padding: 2px;
    }
    :global(.popup-table td) {
        padding: 2px;
        text-align: right;
    }
    .waypoint-table {
        scrollbar-color: white var(--color-gray-dark);
        overflow-y: scroll;
        padding: 0;
        width: 100%;
        height: 160px;
    }
    .waypoint-table table {
        padding-top: 5px;
        width: 100%;
    }
    .waypoint-table thead {
        background: var(--color-gray-dark);
    }
    .waypoint-table th {
        text-align: left;
        font-size: small;
        padding: 2px;
        margin: 0;
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--color-gray-dark);
    }
    .waypoint-table .ident {
        padding-left: 0px !important;
    }
    .waypoint-table .altitude {
        padding-right: 5px !important;
        text-align: right;
    }
    .waypoint-table td {
        padding: 2px;
        font-size: small;
        text-align: left;
    }
    :global(.icon-waypoint) {
        background-color: magenta;
        opacity: 1;
        border-radius: 12px;
        -webkit-border-radius: 12px;
        border-width: 2px;
        border-color: magenta;
        border-style: solid;
    }
    :global(.waypoint-tooltip::before) {
        border-style: none;
        display: none;
    }
    :global(.waypoint-tooltip) {
        background-color: transparent;
        border-style: none;
        box-shadow: none;
        color: white;
        padding-bottom: 2px;
        text-shadow: -1px 0 1px rgba(0,0,0,.6),1px 0 1px rgba(0,0,0,.6),0 1px 1px rgba(0,0,0,.6),0 -1px 1px rgba(0,0,0,.6),
                     -2px 0 2px rgba(0,0,0,.6),2px 0 2px rgba(0,0,0,.6),0 2px 2px rgba(0,0,0,.6),0 -2px 2px rgba(0,0,0,.6);
    }
</style>
