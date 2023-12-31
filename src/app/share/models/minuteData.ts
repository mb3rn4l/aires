// Define una interfaz que refleje la estructura del JSON
export interface Minute {
  equipment_code: string;
  date: string;
  client: string;
  maintenance_type: string;
  brand: string;
  model: string;
  equipment_name: string;
  capacity: string;
  equipment_type: string;
  observations: string;

  technical_data_and_measurements: {
    handling_unit: HandlingUnit;

    compressor_unit: CompressorUnit;

    capacitor_motor: CapacitorMotor;
  };

  work_and_revisions_carried_out: {
    drive_unit: DriveUnit;

    condensing_unit: CondensingUnita;

    air_distribution_system: AirDistributionSystem;
  };
  air_outlet_dampers: AirOutletDampers;

  pressure_uma_pre_mtto: PressureUmaPreMtto;

  pressure_uma_pos_mtto: PressureUmaPosMtto;
}
/******************************************+ */
// ... otras propiedades
export interface HandlingUnit {
  motor_data_plane: {
    w: string;
    vol: string;
    amp: string;
    rpm: string;
  };
  voltage_measurements: {
    val_1: string;
    val_2: string;
    val_3: string;
  };
  amperage: {
    l1: string;
    l2: string;
    l3: string;
  };
}

export interface CompressorUnit {
  plate_data: {
    _1: {
      hp: string;
      vol: string;
      amp: string;
    };
    _2: {
      hp: string;
      vol: string;
      amp: string;
    };
  };
  voltage_measurements: {
    _1: {
      vl1_l2: string;
      vl2_l3: string;
      vl3_l1: string;
    };
    _2: {
      vl1_l2: string;
      vl2_l3: string;
      vl3_l1: string;
    };
  };
  amperage: {
    _1: {
      l1: string;
      l2: string;
      l3: string;
    };
    _2: {
      l1: string;
      l2: string;
      l3: string;
    };
  };
  pressures: {
    _1: {
      tall: string;
      low: string;
    };
    _2: {
      tall: string;
      low: string;
    };
  };
}

export interface CapacitorMotor {
  plate_data: {
    _1: {
      hp: string;
      vol: string;
      amp: string;
      rpm: string;
    };
    _2: {
      hp: string;
      vol: string;
      amp: string;
      rpm: string;
    };
  };
  measurements: {
    _1: {
      vl1_l2: string;
      vl2_l3: string;
      vl3_l1: string;
    };
    _2: {
      vl1_l2: string;
      vl2_l3: string;
      vl3_l1: string;
    };
  };
  amperage: {
    _1: {
      l1: string;
      l2: string;
      l3: string;
    };
    _2: {
      l1: string;
      l2: string;
      l3: string;
    };
  };
}

export interface DriveUnit {
  interior_exterior_cleaning: string;
  coil_serpentines: string;
  adjust_prisoners_of_chumaceras: string;
  air_filter_wash: string;
  belt_tension: string;
  changing_straps: string;
  bearing_review: string;
  internal_insulation_review: string;
  Filter_change: string;
  overall_screw_adjustment: string;
  revision_of_expansion_valves: string;
  review_electrical_accessories: string;
  bimetallic_relay_revision: string;
  electronic_board_cleaning: string;
  thermostat_check: string;
  engine_inspection: string;
  drain_cleaning: string;
}

export interface CondensingUnita {
  interior_exterior_cleaning: string;
  coil_serpentines: string;
  bearing: string;
  compressor_overhaul: string;
  support_status: string;
  overall_screw_adjustment: string;
  review_electrical_accessories: string;
  bimetallic_relay_revision: string;
  refrigerant_pipe_inspection: string;
}

export interface AirDistributionSystem {
  damper_revision: string;
  inspection: string;
  thermometer_review: string;
  general_inspection_ducts: string;
}

export interface AirOutletDampers {
  temperature: {
    _c: string;
  };
  type_of_refrigerant: string;

  equipment_delivery_conditions: string;
  delivery_of_clean_work_area: string;
}

export interface PressureUmaPreMtto {
  parameter: string;
}

export interface PressureUmaPosMtto {
  parameter: string;
}
