export interface SimbriefPlan {
  fetch: Fetch;
  params: Params;
  general: General;
  origin: OriginDestination;
  destination: OriginDestination;
  alternate: Alternate;
  alternate_navlog: AlternateNavlog;
  takeoff_altn: Alternate;
  enroute_altn: EnrouteAltn;
  navlog: Navlog;
  etops: Etops;
  tlr: Tlr;
  atc: Atc;
  aircraft: Aircraft;
  fuel: Fuel;
  fuel_extra: FuelExtra;
  times: Times;
  weights: Weights;
  impacts: Impacts;
  crew: Crew;
  notams: Notams;
  weather: Weather;
  sigmets: Sigmets;
  text: Text;
  tracks: Tracks;
  database_updates: DatabaseUpdates;
  files: Files;
  fms_downloads: FmsDownloads;
  images: Images;
  links: Links;
  prefile: Prefile;
  vatsim_prefile: string;
  ivao_prefile: string;
  pilotedge_prefile: string;
  poscon_prefile: string;
  map_data: string;
  api_params: ApiParams;
}

export interface Fetch {
  userid: string;
  static_id: string;
  status: string;
  time: string;
}

export interface Params {
  request_id: string;
  sequence_id: string;
  static_id: string;
  user_id: string;
  time_generated: string;
  xml_file: string;
  ofp_layout: string;
  airac: string;
  units: string;
}


export interface General {
  release: string;
  icao_airline: string;
  flight_number: string;
  is_etops: string;
  dx_rmk: string[];
  sys_rmk: string;
  is_detailed_profile: string;
  cruise_profile: string;
  climb_profile: string;
  descent_profile: string;
  alternate_profile: string;
  reserve_profile: string;
  costindex: string;
  cont_rule: string;
  initial_altitude: string;
  stepclimb_string: string;
  avg_temp_dev: string;
  avg_tropopause: string;
  avg_wind_comp: string;
  avg_wind_dir: string;
  avg_wind_spd: string;
  gc_distance: string;
  route_distance: string;
  air_distance: string;
  total_burn: string;
  cruise_tas: string;
  cruise_mach: string;
  passengers: string;
  route: string;
  route_ifps: string;
  route_navigraph: string;
  sid_ident: string;
  sid_trans: string;
  star_ident: string;
  star_trans: string;
}

export interface OriginDestination {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  elevation: string;
  pos_lat: string;
  pos_long: string;
  name: string;
  timezone: string;
  plan_rwy: string;
  trans_alt: string;
  trans_level: string;
  metar: string;
  metar_time: string;
  metar_category: string;
  metar_visibility: string;
  metar_ceiling: string;
  taf: string;
  taf_time: string;
  atis: Atis;
  notam: string;
}

export interface Atis {
  network: string;
  issued: string;
  letter: string;
  phonetic: string;
  type: string;
  message: string;
}

export interface Alternate {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  elevation: string;
  pos_lat: string;
  pos_long: string;
  name: string;
  timezone: string;
  plan_rwy: string;
  trans_alt: string;
  trans_level: string;
  cruise_altitude: string;
  distance: string;
  gc_distance: string;
  air_distance: string;
  track_true: string;
  track_mag: string;
  tas: string;
  gs: string;
  avg_wind_comp: string;
  avg_wind_dir: string;
  avg_wind_spd: string;
  avg_tropopause: string;
  avg_tdv: string;
  ete: string;
  burn: string;
  route: string;
  route_ifps: string;
  metar: string;
  metar_time: string;
  metar_category: string;
  metar_visibility: string;
  metar_ceiling: string;
  taf: string;
  taf_time: string;
  atis: Atis[];
  notam: string;
}

export interface AlternateNavlog {
  fix: AlternateFix[];
}

export interface AlternateFix {
  ident: string;
  name: string;
  type: string;
  icao_region: any;
  region_code: any;
  frequency: any;
  pos_lat: string;
  pos_long: string;
  stage: string;
  via_airway: string;
  is_sid_star: string;
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
}

export interface EnrouteAltn {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  elevation: string;
  pos_lat: string;
  pos_long: string;
  name: string;
  timezone: string;
  trans_alt: string;
  trans_level: string;
  metar: string;
  metar_time: string;
  metar_category: string;
  metar_visibility: string;
  metar_ceiling: string;
  taf: string;
  taf_time: string;
  atis: string;
  notam: string;
}

export type Navlog = NavlogFix[];

export interface NavlogFix {
  ident: string;
  name: string;
  type: "ltlg" | "wpt" | "vor" | "apt";
  icao_region: any;
  region_code: any;
  frequency: any;
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
  wind_data: WindData;
  fir_crossing: FirCrossing;
}

export interface WindData {
  level: Level[];
}

export interface Level {
  altitude: string;
  wind_dir: string;
  wind_spd: string;
  oat: string;
}

export interface FirCrossing {
  fir?: Fir;
}

export interface Fir {
  fir_icao: string;
  fir_name: string;
  pos_lat_entry: string;
  pos_long_entry: string;
}

export interface Etops {
  rule: string;
  entry: Entry;
  exit: Exit;
  suitable_airport: SuitableAirport[];
  equal_time_point: EqualTimePoint;
  critical_point: CriticalPoint;
}

export interface Entry {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  pos_lat_apt: string;
  pos_long_apt: string;
  pos_lat_fix: string;
  pos_long_fix: string;
  elapsed_time: string;
  min_fob: string;
  est_fob: string;
  etops_condition: string;
  div_time: string;
  div_burn: string;
  critical_fuel: string;
  div_altitude: string;
  div_airport: DiversionAirport;
}

export interface Exit {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  pos_lat_apt: string;
  pos_long_apt: string;
  pos_lat_fix: string;
  pos_long_fix: string;
  elapsed_time: string;
  min_fob: string;
  est_fob: string;
  etops_condition: string;
  div_time: string;
  div_burn: string;
  critical_fuel: string;
  div_altitude: string;
  div_airport: DiversionAirport;
}

export interface DiversionAirport {
  icao_code: string;
  track_true: string;
  track_mag: string;
  distance: string;
  avg_wind_comp: string;
  avg_temp_dev: string;
  est_fob: string;
}

export interface SuitableAirport {
  icao_code: string;
  iata_code: string;
  faa_code: string;
  icao_region: string;
  name: string;
  pos_lat: string;
  pos_long: string;
  elevation: string;
  timezone: string;
  fcst_cig: string;
  fcst_vis: string;
  plan_rwy: string;
  trans_alt: string;
  trans_level: string;
  suitability_start: string;
  suitability_end: string;
  metar: string;
  metar_time: string;
  metar_category: any;
  metar_visibility: string;
  metar_ceiling: string;
  taf: string;
  taf_time: string;
  atis: string;
  notam: string;
}

export interface EqualTimePoint {
  pos_lat: string;
  pos_long: string;
  elapsed_time: string;
  min_fob: string;
  est_fob: string;
  etops_condition: string;
  div_time: string;
  div_burn: string;
  critical_fuel: string;
  div_altitude: string;
  div_airport: DiversionAirport[];
}

export interface CriticalPoint {
  fix_type: string;
  pos_lat: string;
  pos_long: string;
  elapsed_time: string;
  est_fob: string;
  critical_fuel: string;
}

export interface Tlr {
  takeoff: Takeoff;
  landing: Landing;
}

export interface Takeoff {
  conditions: Conditions;
  runway: Runway[];
}

export interface Conditions {
  airport_icao: string;
  planned_runway: string;
  planned_weight: string;
  wind_direction: string;
  wind_speed: string;
  temperature: string;
  altimeter: string;
  surface_condition: string;
}

export interface Runway {
  identifier: string;
  length: string;
  length_tora: string;
  length_toda: string;
  length_asda: string;
  length_lda: string;
  elevation: string;
  gradient: string;
  true_course: string;
  magnetic_course: string;
  headwind_component: string;
  crosswind_component: string;
  ils_frequency: string;
  flap_setting: string;
  thrust_setting: string;
  bleed_setting: string;
  anti_ice_setting: string;
  flex_temperature: string;
  max_temperature: string;
  max_weight: string;
  limit_code: string;
  limit_obstacle: string;
  speeds_v1: string;
  speeds_vr: string;
  speeds_v2: string;
  speeds_v2_id: string;
  speeds_other: string;
  speeds_other_id: string;
  distance_decide: string;
  distance_reject: string;
  distance_margin: string;
  distance_continue: string;
}

export interface Landing {
  conditions: LandingConditions;
  distance_dry: Distance;
  distance_wet: Distance;
  runway: Runway2[];
}

export interface LandingConditions {
  airport_icao: string;
  planned_runway: string;
  planned_weight: string;
  flap_setting: string;
  wind_direction: string;
  wind_speed: string;
  temperature: string;
  altimeter: string;
  surface_condition: string;
}

export interface Distance {
  weight: string;
  flap_setting: string;
  brake_setting: string;
  reverser_credit: string;
  speeds_vref: string;
  actual_distance: string;
  factored_distance: string;
}

export interface Runway2 {
  identifier: string;
  length: string;
  length_tora: string;
  length_toda: string;
  length_asda: string;
  length_lda: string;
  elevation: string;
  gradient: string;
  true_course: string;
  magnetic_course: string;
  headwind_component: string;
  crosswind_component: string;
  ils_frequency: any;
  max_weight_dry: string;
  max_weight_wet: string;
}

export interface Atc {
  flightplan_text: string;
  route: string;
  route_ifps: string;
  callsign: string;
  flight_type: string;
  flight_rules: string;
  initial_spd: string;
  initial_spd_unit: string;
  initial_alt: string;
  initial_alt_unit: string;
  section18: string;
  fir_orig: string;
  fir_dest: string;
  fir_altn: string;
  fir_etops: string[];
  fir_enroute: string[];
}

export interface Aircraft {
  icaocode: string;
  iatacode: string;
  base_type: string;
  list_type: string;
  icao_code: string;
  iata_code: string;
  name: string;
  engines: string;
  reg: string;
  fin: string;
  selcal: string;
  equip: string;
  equip_category: string;
  equip_navigation: string;
  equip_transponder: string;
  fuelfact: string;
  fuelfactor: string;
  max_passengers: string;
  supports_tlr: string;
  internal_id: string;
  is_custom: string;
}

export interface Fuel {
  taxi: string;
  enroute_burn: string;
  contingency: string;
  alternate_burn: string;
  reserve: string;
  etops: string;
  extra: string;
  extra_required: string;
  extra_optional: string;
  min_takeoff: string;
  plan_takeoff: string;
  plan_ramp: string;
  plan_landing: string;
  avg_fuel_flow: string;
  max_tanks: string;
}

export interface FuelExtra {
  bucket: Bucket[];
}

export interface Bucket {
  label: string;
  fuel: string;
  time: string;
  required: any;
}

export interface Times {
  est_time_enroute: string;
  sched_time_enroute: string;
  sched_out: string;
  sched_off: string;
  sched_on: string;
  sched_in: string;
  sched_block: string;
  est_out: string;
  est_off: string;
  est_on: string;
  est_in: string;
  est_block: string;
  orig_timezone: string;
  dest_timezone: string;
  taxi_out: string;
  taxi_in: string;
  reserve_time: string;
  endurance: string;
  contfuel_time: string;
  etopsfuel_time: string;
  extrafuel_time: string;
}

export interface Weights {
  oew: string;
  pax_count: string;
  bag_count: string;
  pax_count_actual: string;
  bag_count_actual: string;
  pax_weight: string;
  bag_weight: string;
  freight_added: string;
  cargo: string;
  payload: string;
  est_zfw: string;
  max_zfw: string;
  est_tow: string;
  max_tow: string;
  max_tow_struct: string;
  tow_limit_code: string;
  est_ldw: string;
  max_ldw: string;
  est_ramp: string;
}

export interface Impacts {
  minus_6000ft: ImpactEntry;
  minus_4000ft: ImpactEntry;
  minus_2000ft: ImpactEntry;
  plus_2000ft: ImpactEntry;
  plus_4000ft: ImpactEntry;
  plus_6000ft: ImpactEntry;
  higher_ci: ImpactEntry;
  lower_ci: ImpactEntry;
  zfw_plus_1000: ImpactEntry;
  zfw_minus_1000: ImpactEntry;
}

export interface ImpactEntry {
  time_enroute: string;
  time_difference: string;
  enroute_burn: string;
  burn_difference: string;
  ramp_fuel: string;
  initial_fl: string;
  initial_tas: string;
  initial_mach: string;
  cost_index: string;
}

export interface Crew {
  pilot_id: string;
  cpt: string;
  fo: string;
  dx: string;
  pu: string;
  fa: string[];
}

export interface Notams {}

export interface Weather {
  orig_metar: string;
  orig_taf: string;
  dest_metar: string;
  dest_taf: string;
  altn_metar: string;
  altn_taf: string;
  toaltn_metar: string;
  toaltn_taf: string;
  eualtn_metar: string;
  eualtn_taf: string;
  etops_metar: string[];
  etops_taf: string[];
}

export interface Sigmets {
  sigmet: Sigmet[];
}

export interface Sigmet {
  type: string;
  loc: string;
  address: string;
  title: string;
  fir: string;
  fir_name: string;
  id: string;
  hazard: string;
  qualifier: any;
  issued: string;
  start: string;
  end: string;
  text: string;
}

export interface Text {
  nat_tracks: string;
  tlr_section: string;
  plan_html: string;
}

export interface Tracks {
  nat_notams: NatNotams;
  nat: NatTrack[];
}

export interface NatNotams {
  eggx: string;
  czqx: string;
}

export interface NatTrack {
  id: string;
  group: string;
  addr: string;
  tmi: string;
  route: string;
  levels: string;
  start: string;
  end: string;
  fixes: Fixes;
}

export interface Fixes {
  fix: Fix3[];
}

export interface Fix3 {
  ident: string;
  pos_lat: string;
  pos_long: string;
}

export interface DatabaseUpdates {
  metar_taf: string;
  winds: string;
  sigwx: string;
  sigmet: string;
  notams: string;
  tracks: string;
}

export interface Files {
  directory: string;
  pdf: NameLink;
  file: NameLink[];
}

export interface FmsDownloads {
  directory: string;
  [ext: string]: string | NameLink;
}

export interface NameLink {
  name: string;
  link: string;
}

export interface Images {
  directory: string;
  map: NameLink[];
}

export interface Links {
  skyvector: string;
}

export interface Prefile {
  [providerName: string]: PrefileProvider;
}

export interface PrefileProvider extends NameLink {
  site: string;
  form: string;
}

export interface ApiParams {
  [key: string]: any;
}

