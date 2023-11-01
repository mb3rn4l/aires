const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../permissions.json');

const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require('express');
const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));

// consulta los ultimos 5 informes segun codigo de equipo
app.get('/api/minutes/:equipment_code', async (req: any, res: any) => {
  try {
    const equipmentCode = req.params.equipment_code;

    console.log(
      `------ CONSULTA ACTAS PARA EQUIPO [ ${equipmentCode} ] -----------------------------------------------------------------------------`
    );

    const querySnapshot = await db
      .collection('minutes')
      .where('equipment_code', '==', equipmentCode)
      .orderBy('date', 'desc')
      .limit(5)
      .get();

    const response = querySnapshot.docs.map((doc: any) => {
      const data = doc.data();

      return {
        id: doc.id,
        date: data.date,
        maintenance_type: data.maintenance_type,
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(
      `------ ERROR AL CONSULTAR -----------------------------------------------------------------------------`
    );

    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Descarga el pdf segun el identificador del acta
app.get('/api/minutes2/:id', async (req: any, res: any) => {
  try {
    const id = req.params.id;

    console.log(
      `------ PDF DOC[ ${id} ] -----------------------------------------------------------------------------`
    );

    const querySnapshot = await db.collection('minutes').doc(id).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const data = querySnapshot.data();

    // llamar a la funcion para construir html
    const htmlContent = getHtmlContent(data); // Aquí se llama a la función y se le pasa la data

    // console.log(htmlContent);

    ///--------------------------------------
    // PDF
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent); // Usar el HTML generado

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      scale: 0.9,
    });

    await browser.close();

    // res.set('Content-Type', 'application/pdf');
    // res.download(pdf);
    res.send(pdf);
  } catch (error) {
    console.log(
      `------ ERROR AL GENERAR PDF -----------------------------------------------------------------------------`
    );
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function shouldMark(value: string, targetValue: string): boolean {
  return value === targetValue;
}

function getHtmlContent(minuteData: any) {
  const html = `
  <div class="container-fluid">
  <!-- Stack the columns on mobile by making one full-width and the other half-width -->
  <br />
  <div class="row">
    <div class="col-6 col-md-4 offset-md-1">
      <!-- CONTENEDOR INFO DE LA EMPRESA -->
      <div
        id="container-infoE"
        style="
          padding: 5px;
          border: 1px solid #ccc;
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div class="image-container">
          <img
            src="data:image/png;base64,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"
            style="width: 70px; margin-right: 30px"
          />
        </div>
        <div class="text-container" style="margin-top: 10px">
          <p>
          <strong>
            CALI-AIRES S.A.S <br />
            NIT. 901 055 034 - 5 <br />
            INFORME TECNICO
          </strong>
          </p>
        </div>
      </div>
    </div>
    <div class="col-6 col-md-4 offset-md-1">
      <br />
      <!-- CONTENEDOR DEL CODIGO -->
      <div
        id="container-Code"
        style="
          padding: 5px;
          border: 1px solid #ccc;
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        "
      >
        <span>
          <span> <strong>CODIGO DE EQUIPO N°</strong></span>
          <br />
          <span> ${minuteData?.equipment_code}</span>
        </span>
      </div>
    </div>
  </div>
  <br />
  <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
  <div class="row">
    <div class="col-12 col-md-9 offset-md-1">
      <!-- CONTENEDOR1 -->
      <div
        id="container1"
        style="
          padding: 5px;
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          align-items: center;
        "
      >
        <table class="table table-borderless table-sm">
          <tr>
            <th>
              <span>FECHA:</span>
              <span style="font-weight: normal;"> ${minuteData?.date} </span>
            </th>
            <th>
              <span>MARCA:</span>
              <span style="font-weight: normal;"> ${minuteData?.brand} </span>
            </th>
            <th>
              <span>CAPACIDAD:</span>
              <span></span>
              <span style="font-weight: normal;"> ${
                minuteData?.capacity
              } </span>
            </th>
          </tr>
          <tr>
            <th>
              <span>CLIENTE:</span>
              <span style="font-weight: normal;"> ${minuteData?.client}</span>
            </th>
            <th>
              <span>MODELO:</span>
              <span style="font-weight: normal;">${minuteData?.model}</span>
            </th>
            <th>
              <span>TIPO DE EQUIPO:</span>
              <span style="font-weight: normal;">${
                minuteData?.equipment_type
              }</span>
            </th>
          </tr>
          <tr>
            <th>
              <span>TIPO MNTTO:</span>

              <span style="font-weight: normal;">${
                minuteData?.maintenance_type
              }</span>
            </th>
            <th colspan="2">
              <span>NOMBRE DE EQUIPO:</span>
              <span style="font-weight: normal;">${
                minuteData?.equipment_name
              }</span>
            </th>
          </tr>
        </table>
      </div>
    </div>
  </div>

  <!-- Columns are always 50% wide, on mobile and desktop -->
  <div class="row">
    <div class="col-12 col-md-3 offset-md-1">
      <!-- CONTENEDOR2 -->
      <div
        id="container2"
        style="
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;

          align-items: center;
        "
      >
        <table class="table table-bordered border-primary table-sm">
          <tr>
            <th colspan="3" style="text-align: center">DATOS TECNICOS Y MEDICONES</th>
          </tr>
          <tr>
            <th colspan="3" style="text-align: center">UNIDAD MANEJADORA</th>
          </tr>
          <tr>
            <th 
              rowspan="4"
              style="text-align: center; vertical-align: middle"
            >MOTOR DATOS DE PLACA</th>
            <th>W</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.motor_data_plane?.w
            }
            </td>
          </tr>
          <tr>
            <th>VOL</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.motor_data_plane?.vol
            }
            </td>
          </tr>
          <tr>
            <th>AMP</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.motor_data_plane?.amp
            }
            </td>
          </tr>
          <tr>
            <th>RPM</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.motor_data_plane?.rpm
            }
            </td>
          </tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">MEDICIONES VOLTAJE</th>
            <th></th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_1
            }
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_2
            }
            </td>
          </tr>
          <tr>
            <th></th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_3
            }
            </td>
          </tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">AMPERAJE</th>
            <th>L1</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_1
            }
            </td>
          </tr>
          <tr>
            <th>L2</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_2
            }
            </td>
          </tr>
          <tr>
            <th>L3</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.handling_unit
                ?.voltage_measurements?.val_3
            }
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="col-12 col-md-7">
      <div
        id="container5"
        style="
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;

          align-items: center;
        "
      >
        <table class="table table-bordered table-sm">
          <tr>
            <th colspan="8" style="text-align: center;">LABORES Y REVISIONES REALIZADAS</th>
          </tr>
          <tr>
            <th colspan="8" style="text-align: center;">UNIDAD DE MANEJO</th>
          </tr>
          <tr>
            <th></th>
            <th>EF</th>
            <th>COM</th>
            <th>N/A</th>
            <th></th>
            <th>EF</th>
            <th>COM</th>
            <th>N/A</th>
          </tr>
          <tr>
            <th>LIMPIEZA INTERIOR-EXTERIOR</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.interior_exterior_cleaning,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.interior_exterior_cleaning,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.interior_exterior_cleaning,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>

            <th>AJUSTE GENERAL DE TORNILOS</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.overall_screw_adjustment,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.overall_screw_adjustment,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.overall_screw_adjustment,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
          <tr>
            <th>LAVADO DE SERPENTINES</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.coil_serpentines,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.coil_serpentines,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.coil_serpentines,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>

            <th>
              REVISION VALVULAS<br />
              DE TORNILLOS
            </th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.revision_of_expansion_valves,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.revision_of_expansion_valves,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.revision_of_expansion_valves,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
          <tr>
            <th>AJUSTES PRIONEROS DE CHUMAREJAS</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.adjust_prisoners_of_chumaceras,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.adjust_prisoners_of_chumaceras,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.adjust_prisoners_of_chumaceras,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>

            <th>
              REVISION ACCESORIOS ELECTRICOS Y AJUSTES DE TORNILLERIA TAB. DE
              CONTROL
            </th>
            <th>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.review_electrical_accessories,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.review_electrical_accessories,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.review_electrical_accessories,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
          <tr>
            <th>LAVADO FILTRO DE AIRE</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.air_filter_wash,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.air_filter_wash,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.air_filter_wash,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>

            <th>REVISION RELE BIOMETALICO</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.bimetallic_relay_revision,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.bimetallic_relay_revision,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.bimetallic_relay_revision,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>
          </tr>
          <tr>
            <th>TENSION DE CORREAS</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.belt_tension,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <th>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.belt_tension,
                'COM'
              )
                ? '✓'
                : ''
            }
            </th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.belt_tension,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>

            <th>LIMPIEZA TABLERO ELECTRONICO</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.electronic_board_cleaning,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.electronic_board_cleaning,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.electronic_board_cleaning,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
          <tr>
            <th>CAMBIO DE CORREAS</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.changing_straps,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.changing_straps,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.changing_straps,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>

            <th>REVISION TERMOSTATO</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.thermostat_check,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.thermostat_check,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.thermostat_check,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>
          </tr>
          <tr>
            <th>REVISION RODAMIENTOS</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.bearing_review,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.bearing_review,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.bearing_review,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>

            <th>INSPECCION MOTOR</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.engine_inspection,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <th>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.engine_inspection,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.engine_inspection,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>
          </tr>
          <tr>
            <th>REVISION AISLAMIENTO INTERIOR</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.internal_insulation_review,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.internal_insulation_review,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.internal_insulation_review,
                  'NA'
                )
                  ? '✓'
                  : ''
              }
            </td>

            <th>LIMPIEZA DE DESAGUES</th>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.drain_cleaning,
                  'EF'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.drain_cleaning,
                'COM'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.drain_cleaning,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
          <tr>
            <th>CAMBIO FILTRO</th>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.Filter_change,
                'EF'
              )
                ? '✓'
                : ''
            }
            </td>
            <td>
              ${
                shouldMark(
                  minuteData?.work_and_revisions_carried_out?.drive_unit
                    ?.Filter_change,
                  'COM'
                )
                  ? '✓'
                  : ''
              }
            </td>
            <td>
            ${
              shouldMark(
                minuteData?.work_and_revisions_carried_out?.drive_unit
                  ?.Filter_change,
                'NA'
              )
                ? '✓'
                : ''
            }
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <!-- otra fila -->
  <br />
  <div class="row">
    <div class="col-12 col-md-3 offset-md-1">
      <!-- CONTENEDOR3 -->
      <div
        id="container3"
        style="
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;

          align-items: center;
        "
      >
        <table class="table table-bordered table-sm">
          <tr>
            <th colspan="4" style="text-align: center">UNIDAD COMPRESORA</th>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th>1</th>
            <th>2</th>
          </tr>
          <tr>
            <th rowspan="4" style="text-align: center; vertical-align: middle">DATOS DE PLACA</th>
            <th>HP</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.plate_data?._1?.hp
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.plate_data?._2?.hp
              }
            </td>
          </tr>
          <tr>
            <th>VOL</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.plate_data?._1?.vol
            }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.plate_data?._2?.vol
            }
            </td>
          </tr>
          <tr>
            <th>AMP</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.plate_data?._1?.amp
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.plate_data?._2?.amp
              }
            </td>
          </tr>
          <tr></tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">MEDICIONES VOLTAJE</th>
            <th>VL1-L2</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.voltage_measurements?._1?.vl1_l2
            }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.voltage_measurements?._2?.vl1_l2
            }
            </td>
          </tr>
          <tr>
            <th>VL2-L3</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.voltage_measurements?._1?.vl2_l3
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.voltage_measurements?._2?.vl2_l3
              }
            </td>
          </tr>
          <tr>
            <th>VL3-L1</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.voltage_measurements?._1?.vl3_l1
              }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.voltage_measurements?._2?.vl3_l1
            }
            </td>
          </tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">AMPERAJE</th>
            <th>L1</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.amperage?._1?.l1
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.amperage?._2?.l1
              }
            </td>
          </tr>
          <tr>
            <th>L2</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.amperage?._1?.l2
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.amperage?._2?.l2
              }
            </td>
          </tr>
          <tr>
            <th>L3</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.amperage?._1?.l3
            }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.amperage?._2?.l3
              }
            </td>
          </tr>
          <tr>
            <th rowspan="2" style="text-align: center; vertical-align: middle">PRESIONES (ESTADOS)</th>
            <th>ALTA</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.pressures?._1?.tall
              }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.pressures?._2?.tall
            }
            </td>
          </tr>
          <tr>
            <th>BAJA</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.compressor_unit
                ?.pressures?._1?.low
            }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.compressor_unit
                  ?.pressures?._2?.low
              }
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="col-sm-7">
      <div class="row">
        <div class="col-12 col-sm-12">
          <!-- CONTENEDOR6 -->
          <div
            id="container6"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th colspan="8" style="text-align: center">UNIDAD CONDENSADORA</th>
              </tr>
              <tr>
                <th></th>
                <th>EF</th>
                <th>COM</th>
                <th>N/A</th>
                <th></th>
                <th>EF</th>
                <th>COM</th>
                <th>N/A</th>
              </tr>
              <tr>
                <th>LIMPIEZA INTERIOR-EXTERIOR</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.interior_exterior_cleaning,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.interior_exterior_cleaning,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.interior_exterior_cleaning,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>

                <th>AJUSTE GENERAL DE TORNILOS</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.overall_screw_adjustment,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.overall_screw_adjustment,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.overall_screw_adjustment,
                      'NA'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
              </tr>
              <tr>
                <th>LAVADO DE SERPENTINES</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.coil_serpentines,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.coil_serpentines,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.coil_serpentines,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>

                <th>
                  REVISION ACCESORIOS ELECTRICOS Y AJUSTES DE TORNILLERIA TAB.
                  DE CONTROLTORNILLERIA TAB. DE CONTROL
                </th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.review_electrical_accessories,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.review_electrical_accessories,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.review_electrical_accessories,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>
              </tr>
              <tr>
                <th>RODAMIENTOS</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.bearings,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.bearing,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.bearing,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>

                <th>REVISION RELE BIOMETALICO</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.bimetallic_relay_revision,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.bimetallic_relay_revision,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.bimetallic_relay_revision,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>
              </tr>
              <tr>
                <th>REVISION DE COMPRESOR</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.compressor_overhaul,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.compressor_overhaul,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.compressor_overhaul,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>

                <th rowspan="2">INSPECCION DE TUBERIA <br />REFIGERANTE</th>
                <td rowspan="2">
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.refrigerant_pipe_inspection,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td rowspan="2">
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.refrigerant_pipe_inspection,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td rowspan="2">
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.refrigerant_pipe_inspection,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>
              </tr>
              <tr>
                <th>ESTADO DE SOPORTE</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.support_status,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out?.condensing_unit
                      ?.support_status,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.condensing_unit?.support_status,
                      'NA'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-12 col-md-10">
          <div
            id="container7"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th colspan="8" style="text-align: center">SISTEMA DE DISTRIBUCION DE AIRE</th>
              </tr>
              <tr>
                <th></th>
                <th>EF</th>
                <th>COM</th>
                <th>N/A</th>
                <th></th>
                <th>EF</th>
                <th>COM</th>
                <th>N/A</th>
              </tr>
              <tr>
                <th>REVISION DAMPERS</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.damper_revision,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.damper_revision,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.air_distribution_system?.damper_revision,
                      'NA'
                    )
                      ? '✓'
                      : ''
                  }
                </td>

                <th>REVISION TERMOMETRO</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.thermometer_review,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.air_distribution_system?.thermometer_review,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.thermometer_review,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </td>
              </tr>
              <tr>
                <th>INSPECCION</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.air_distribution_system?.inspection,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.inspection,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.work_and_revisions_carried_out
                        ?.air_distribution_system?.inspection,
                      'NA'
                    )
                      ? '✓'
                      : ''
                  }
                </td>

                <th>REVISION GENERAL CONDUCTOS</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.general_inspection_ducts,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.general_inspection_ducts,
                    'COM'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <th>
                ${
                  shouldMark(
                    minuteData?.work_and_revisions_carried_out
                      ?.air_distribution_system?.general_inspection_ducts,
                    'NA'
                  )
                    ? '✓'
                    : ''
                }
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br />
  <!-- otra fila -->
  <div class="row">
    <div class="col-12 col-md-3 offset-md-1">
      <div
        id="container4"
        style="
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;

          align-items: center;
        "
      >
        <table class="table table-bordered table-sm">
          <tr>
            <th colspan="4" style="text-align: center">MOTOR CONDENSADORA</th>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th>1</th>
            <th>2</th>
          </tr>
          <tr>
            <th rowspan="4" style="text-align: center; vertical-align: middle">DATOS DE PLACA</th>
            <th>HP</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.plate_data?._1?.hp
              }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.plate_data?._2?.hp
            }
            </td>
          </tr>
          <tr>
            <th>VOL</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.plate_data?._1?.vol
              }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.plate_data?._2?.vol
            }
            </td>
          </tr>
          <tr>
            <th>AMP</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.plate_data?._1?.amp
            }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.plate_data?._2?.amp
              }
            </td>
          </tr>
          <tr>
            <th>RPM</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.plate_data?._1?.rpm
            }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.plate_data?._2?.rpm
              }
            </td>
          </tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">MEDICIONES VOLTAJE</th>
            <th>VL1-L2</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.measurements?._1?.vl1_l2
            }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.measurements?._2?.vl1_l2
            }
            </td>
          </tr>
          <tr>
            <th>VL2-L3</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.measurements?._1?.vl2_l3
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.measurements?._2?.vl2_l3
              }
            </td>
          </tr>
          <tr>
            <th>VL3-L1</th>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.measurements?._1?.vl3_l1
            }
            </td>
            <td>
            ${
              minuteData?.technical_data_and_measurements?.capacitor_motor
                ?.measurements?._2?.vl3_l1
            }
            </td>
          </tr>
          <tr>
            <th rowspan="3" style="text-align: center; vertical-align: middle">AMPERAJE</th>
            <th>L1</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._1?.l1
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._2?.l1
              }
            </td>
          </tr>
          <tr>
            <th>L2</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._1?.l2
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._2?.l2
              }
            </td>
          </tr>
          <tr>
            <th>L3</th>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._1?.l3
              }
            </td>
            <td>
              ${
                minuteData?.technical_data_and_measurements?.capacitor_motor
                  ?.amperage?._2?.l3
              }
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="col-sm-7">
      <div class="row">
        <div class="col-8 col-sm-6">
          <!-- CONTENEDOR8 -->
          <div
            id="container8"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th>DAMPERS SALIDA DE AIRE</th>
                <th>°C</th>
              </tr>
              <tr>
                <th>TEMPERATURA</th>
                <td>
                ${minuteData?.air_outlet_dampers?.temperature?._c}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="col-4 col-sm-6">
          <!-- CONTENEDOR11 -->
          <div
            id="container11"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table
              class="table table-bordered table-sm"
              style="
                border: 1px solid #007bff; /* Color primario de borde */
                border-collapse: collapse; /* Colapsar bordes */
                width: 100%;
              "
            >
              <tr
                style="
                  border: 1px solid #007bff; /* Color primario de borde */
                  border-collapse: collapse; /* Colapsar bordes */
                  width: 100%;
                "
              >
                <th>DIF. DE PRESION UMA PRE-MTTO</th>
                <th>35%</th>
                <th>65%</th>
                <th>95%</th>
              </tr>
              <tr>
                <th>PARAMETRO(0,2 A 1,5 INCA)</th>
                <td>
                ${
                  shouldMark(minuteData?.pressure_uma_pre_mtto.parameter, '35')
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(minuteData?.pressure_uma_pre_mtto.parameter, '65')
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.pressure_uma_pre_mtto.parameter,
                      '95'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>
        <br />

        <div class="col-8 col-sm-6">
          <!-- CONTENEDOR9 -->
          <div
            id="container9"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm border-primary">
              <tr>
                <th>TIPO DE REFIGERANTE</th>
                <td>
                ${minuteData?.air_outlet_dampers?.type_of_refrigerant}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="col-8 col-sm-6"></div>

        <div class="col-8 col-sm-6">
          <!-- CONTENEDOR10 -->
          <div
            id="container10"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th></th>
                <th>EF</th>
                <th>COM</th>
              </tr>
              <tr>
                <th>CONDICIONES ENTREGA DE EQUIPO</th>
                <td>
                  ${
                    shouldMark(
                      minuteData?.air_outlet_dampers
                        ?.equipment_delivery_conditions,
                      'EF'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.air_outlet_dampers
                        ?.equipment_delivery_conditions,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
              </tr>
              <tr>
                <th>ENTREGA DE AREA LIMPIA DE TRABAJO</th>
                <td>
                ${
                  shouldMark(
                    minuteData?.air_outlet_dampers?.delivery_of_clean_work_area,
                    'EF'
                  )
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                  ${
                    shouldMark(
                      minuteData?.air_outlet_dampers
                        ?.delivery_of_clean_work_area,
                      'COM'
                    )
                      ? '✓'
                      : ''
                  }
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="col-4 col-sm-6">
          <!-- CONTENEDOR12 -->
          <div
            id="container12"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th>DIF. DE PRESION UMA POS-MTTO</th>
                <th>35%</th>
                <th>65%</th>
                <th>95%</th>
              </tr>
              <tr>
                <th>PARAMETRO(0,2 A 1,5 INCA)</th>
                <td>
                ${
                  shouldMark(minuteData?.pressure_uma_pos_mtto.parameter, '35')
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(minuteData?.pressure_uma_pos_mtto.parameter, '65')
                    ? '✓'
                    : ''
                }
                </td>
                <td>
                ${
                  shouldMark(minuteData?.pressure_uma_pos_mtto.parameter, '95')
                    ? '✓'
                    : ''
                }
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div class="col-8 col-sm-6">
          <!-- CONTENEDOR13 -->
          <div
            id="container13"
            style="
              font-family: 'Calibri Light', sans-serif;
              font-size: 13px;
              color: #000000;

              align-items: center;
            "
          >
            <table class="table table-bordered table-sm">
              <tr>
                <th>OBSERVACIONES:</th>
              </tr>
              <tr>
                <th>
                  <span style="white-space: pre-line; font-weight: normal;"
                    >${minuteData?.observations}</span
                  >
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- fin -->
  <br />
  <!-- ultima fila -->
  <div
    class="row offset-md-1"
    style="
      font-family: 'Calibri Light', sans-serif;
      font-size: 13px;
      color: #000000;

      align-items: center;
    "
  >
    <div class="col">
      <span style="border-bottom: 1px solid #ccc">
        ${minuteData?.user}
      </span>
      <br />
      <strong>EJECUTOR</strong>
    </div>
    <div class="col">
      <span style="border-bottom: 1px solid #ccc">
        ${minuteData?.client_witness}
      </span>
      <br />
      <strong>PERSONA QUE RECIBE</strong>
    </div>
    <div class="col"></div>
  </div>
</div>

<!-- **************************************************************** -->
<style>
.table-bordered td, .table-bordered th {
  border-color: #ccc;
}

.table td, .table th{
  border-color: #ccc;
}
</style>

<!-- Latest compiled and minified CSS -->
<link
rel="stylesheet"
href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0
.0/css/bootstrap.min.css"
/>
<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min
.js"></script>
<!-- Popper JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/p
opper.min.js"></script>
<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.
min.js"></script>

`;

  return html;
}

exports.app = functions.https.onRequest(app);
