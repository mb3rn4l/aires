import { Minute } from './share/models/minuteData';

export const data: Minute = {
  equipment_code: '',
  date: '',
  client: '',
  maintenance_type: '',
  brand: '',
  model: '',
  equipment_name: '',
  capacity: '',
  equipment_type: '',
  user: '',
  client_witness: '',
  observations: '',

  technical_data_and_measurements: {
    handling_unit: {
      motor_data_plane: {
        w: '',
        vol: '',
        amp: '',
        rpm: '',
      },
      voltage_measurements: {
        val_1: '',
        val_2: '',
        val_3: '',
      },
      amperage: {
        l1: '',
        l2: '',
        l3: '',
      },
    },

    compressor_unit: {
      plate_data: {
        _1: {
          hp: '',
          vol: '',
          amp: '',
        },
        _2: {
          hp: '',
          vol: '',
          amp: '',
        },
      },
      voltage_measurements: {
        _1: {
          vl1_l2: '',
          vl2_l3: '',
          vl3_l1: '',
        },
        _2: {
          vl1_l2: '',
          vl2_l3: '',
          vl3_l1: '',
        },
      },
      amperage: {
        _1: {
          l1: '',
          l2: '',
          l3: '',
        },
        _2: {
          l1: '',
          l2: '',
          l3: '',
        },
      },
      pressures: {
        _1: {
          tall: '',
          low: '',
        },
        _2: {
          tall: '',
          low: '',
        },
      },
    },

    capacitor_motor: {
      plate_data: {
        _1: {
          hp: '',
          vol: '',
          amp: '',
          rpm: '',
        },
        _2: {
          hp: '',
          vol: '',
          amp: '',
          rpm: '',
        },
      },
      measurements: {
        _1: {
          vl1_l2: '',
          vl2_l3: '',
          vl3_l1: '',
        },
        _2: {
          vl1_l2: '',
          vl2_l3: '',
          vl3_l1: '',
        },
      },
      amperage: {
        _1: {
          l1: '',
          l2: '',
          l3: '',
        },
        _2: {
          l1: '',
          l2: '',
          l3: '',
        },
      },
    },
  },
  work_and_revisions_carried_out: {
    drive_unit: {
      interior_exterior_cleaning: '',
      coil_serpentines: '',
      adjust_prisoners_of_chumaceras: '',
      air_filter_wash: '',
      belt_tension: '',
      changing_straps: '',
      bearing_review: '',
      internal_insulation_review: '',
      Filter_change: '',
      overall_screw_adjustment: '',
      revision_of_expansion_valves: '',
      review_electrical_accessories: '',
      bimetallic_relay_revision: '',
      electronic_board_cleaning: '',
      thermostat_check: '',
      engine_inspection: '',
      drain_cleaning: '',
    },
    condensing_unit: {
      interior_exterior_cleaning: '',
      coil_serpentines: '',
      bearing: '',
      compressor_overhaul: '',
      support_status: '',
      overall_screw_adjustment: '',
      review_electrical_accessories: '',
      bimetallic_relay_revision: '',
      refrigerant_pipe_inspection: '',
    },
    air_distribution_system: {
      damper_revision: '',
      inspection: '',
      thermometer_review: '',
      general_inspection_ducts: '',
    },
  },
  air_outlet_dampers: {
    temperature: {
      _c: '',
    },
    type_of_refrigerant: '',

    equipment_delivery_conditions: '',
    delivery_of_clean_work_area: '',
  },
  pressure_uma_pre_mtto: {
    parameter: '',
  },
  pressure_uma_pos_mtto: {
    parameter: '',
  },
};
