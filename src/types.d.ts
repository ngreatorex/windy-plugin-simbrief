export interface BoatResult {
    heading: number;
    rank: number;
    sail: string;
    timestamp: number;
    lat_dec: number;
    lon_dec: number;
    lastreport_heading: number;
    lastreport_speed: number;
    lastreport_vmg: number;
    lastreport_distance: number;
    total_time: string;
    track: [number, number][];
}

export interface DisplayedBoat extends BoatResult {
    // We attach color later
    color: string;
}

export interface ExtendedMarker {
    waypoint: NavlogEntry;
    marker: L.Marker;
}

export type Track = [number, number][]; 

export type SimBriefApiPayloadAirport = {
  icao_code: string;
  icao_region: string;
  pos_lat: string;
  pos_long: string;
  /**
   * Feet
   */
  elevation: string;
  name: string;
  plan_rwy: string;
  metar: string;
  /**
   * Meters
   */
  metar_visibility: string;
  /**
   * Feet
   */
  metar_ceiling: string;
  metar_category: string;
};
export type NavlogEntry = {
  ident: string;
  name: string;
  type: "ltlg" | "wpt" | "vor" | "apt";
  icao_region: string;
  /**
   * Can be in kHz or MHz
   */
  frequency: string;
  pos_lat: string;
  pos_long: string;
  stage: string;
  via_airway: string;
  is_sid_star: "0" | "1";
  distance: string;
  track_true: string;
  track_mag: string;
  heading_true: string;
  heading_mag: string;
  altitude_feet: string;
  ind_airspeed: string;
  true_airspeed: string;
  mach: string;
  mach_thousandths: string;
  wind_component: string;
  groundspeed: string;
  time_leg: string;
  time_total: string;
  fuel_flow: string;
  fuel_leg: string;
  fuel_totalused: string;
  fuel_min_onboard: string;
  fuel_plan_onboard: string;
  oat: string;
  oat_isa_dev: string;
  wind_dir: string;
  wind_spd: string;
  shear: string;
  tropopause_feet: string;
  ground_height: string;
  fir: string;
  fir_units: string;
  fir_valid_levels: string;
  mora: string;
  wind_data: {
    level: WindAtPoint[];
  };
};

export type WindAtPoint = {
  altitude: string;
  wind_dir: string;
  wind_spd: string;
  oat: string;
};

export type SimBriefApiPayloadFmsDownload = {
  name: string;
  link: string;
};
export type SimBriefApiPayload = {
  general: {
    cruise_tas: string;
  };
  origin: SimBriefApiPayloadAirport;
  destination: SimBriefApiPayloadAirport;
  navlog: {
    fix: NavlogEntry[];
  };
  atc: {
    callsign: string;
  };
  aircraft: {
    icaocode: string;
    reg: string;
  };
  times: {
    sched_out: string;
  };
  fms_downloads: {
    directory: string;
    mfs: SimBriefApiPayloadFmsDownload;
    mfn: SimBriefApiPayloadFmsDownload;
  };
};
export type SimBriefApiError = {
  fetch: {
    userid: string;
    static_id: string;
    status: string;
    time: string;
  };
};
