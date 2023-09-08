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

    technical_data_and_measurements:{
        handling_unit: HandlingUnit

        compressor_unit: CompressorUnit

        capacitor_motor: CapacitorMotor
    };


    work_and_revisions_carried_out:{
        drive_unit: DriveUnit

        condensing_unit: CondensingUnita

        air_distribution_system: AirDistributionSystem
      }
    air_outlet_dampers: AirOutletDampers

    pressure_uma_pre_mtto: PressureUmaPreMtto

    pressure_uma_pos_mtto: PressureUmaPosMtto

    
  }
  /******************************************+ */
  // ... otras propiedades
  export interface HandlingUnit{
    
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

    export interface CompressorUnit{
    
        plate_data: {
            _1:{
                hp: string;
                vol: string;
                amp: string;
              };
            _2:{
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
    };

    export interface  DriveUnit{

        interior_exterior_cleaning:{
          ef:boolean;
          com:boolean;
          n_a:boolean;
        };
        coil_serpentines:{
          ef:boolean;
          com:boolean;
          n_a:boolean;
        };
         adjust_prisoners_of_chumaceras:{
          ef:boolean;
          com:boolean;
          n_a:boolean;
        };
        air_filter_wash:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        belt_tension:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        changing_straps:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        bearing_review:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        internal_insulation_review:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        Filter_change:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        overall_screw_adjustment:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        revision_of_expansion_valves:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        review_electrical_accessories:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        bimetallic_relay_revision:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        electronic_board_cleaning:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        thermostat_check:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        engine_inspection:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
        drain_cleaning:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
    }

    export interface CondensingUnita{
        interior_exterior_cleaning:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          coil_serpentines:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          bearing:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          compressor_overhaul:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          support_status:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          overall_screw_adjustment:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          review_electrical_accessories:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          bimetallic_relay_revision:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          refrigerant_pipe_inspection:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };

    }

    export interface AirDistributionSystem{
        damper_revision:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          inspection:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          thermometer_review:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
          general_inspection_ducts:{
            ef:boolean;
            com:boolean;
            n_a:boolean;
        };
    }
   
    export interface AirOutletDampers{
        temperature:{
          _c:string;
        };
        type_of_refrigerant:string;

        equipment_delivery_conditions:{
          ef:boolean;
          com:boolean;          
        };
        delivery_of_clean_work_area:{
          ef:boolean;
          com:boolean;
        };
    }

  
    export interface PressureUmaPreMtto{
        parameter:{
          _35:boolean;
          _65:boolean;
          _95:boolean;
           }
    }

    export interface PressureUmaPosMtto{
        parameter:{
          _35:boolean;
          _65:boolean;
          _95:boolean;
           }
    }
