const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require('express');
const app = express();
const db = admin.firestore();

app.get('/api/minutes/:equipment_code', async (req: any, res: any) => {
  try {
    const equipmentCode = req.params.equipment_code;
    const querySnapshot = await db
      .collection('minutes')
      .where('equipment_code', '==', equipmentCode)
      .get();
    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/minutes2/:equipment_code', async (req: any, res: any) => {
  try {
    console.log(
      '-------------------------------------ENTRO A LA FUNCION----------------------------------------------'
    );

    const equipmentCode = req.params.equipment_code;
    const querySnapshot = await db
      .collection('minutes')
      .where('equipment_code', '==', equipmentCode)
      .get();
    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const htmlContent = getHtmlContent(data); // Aquí se llama a la función y se le pasa la data
    // Consola de depuración: imprime el HTML generado en la consola
    console.log(htmlContent);
    // llamar a la funcion para construir html

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

    res.set('Content-Type', 'application/pdf');
    res.send(pdf);
  } catch (error) {
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
          border: 1px solid #000000;
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;
          display: flex;
          align-items: center;
        "
      >
        <div class="image-container">
          <img
            src="assets/logo_cali_airesrm.png"
            style="width: 70px; margin-right: 30px"
          />
        </div>
        <div class="text-container" style="margin-top: 10px">
          <p>
            <strong>
              CALI-AIRES S.A.S <br />NIT. 901 055 034 - 5 <br />INFORME
              TECNICO</strong
            >
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
          border: 1px solid #000000;
          font-family: 'Calibri Light', sans-serif;
          font-size: 13px;
          color: #000000;

          align-items: center;
        "
      >
        <p>
          <span> <strong>CODIGO DE EQUIPO N°.</strong></span>
          <span> ${minuteData?.equipment_code}</span>
        </p>
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
            <th colspan="3">DATOS TECNICOS Y MEDICONES</th>
          </tr>
          <tr>
            <th colspan="3">UNIDAD MANEJADORA</th>
          </tr>
          <tr>
            <th rowspan="4">MOTOR DATOS DE PLACA</th>
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
            <th rowspan="3">MEDICIONES VOLTAJE</th>
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
            <th rowspan="3">AMPERAJE</th>
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
            <th colspan="8">LABORES Y REVISIONES REALIZADAS</th>
          </tr>
          <tr>
            <th colspan="8">UNIDAD DE MANEJO</th>
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
            <th colspan="4">UNIDAD COMPRESORA</th>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th>1</th>
            <th>2</th>
          </tr>
          <tr>
            <th rowspan="4">DATOS DE PLACA</th>
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
            <th rowspan="3">MEDICIONES VOLTAJE</th>
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
            <th rowspan="3">AMPERAJE</th>
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
            <th rowspan="2">PRESIONES (ESTADOS)</th>
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
                <th colspan="8">UNIDAD CONDENSADORA</th>
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
                <th colspan="8">SISTEMA DE DISTRIBUCION DE AIRE</th>
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
            <th colspan="4">MOTOR CONDENSADORA</th>
          </tr>
          <tr>
            <th colspan="2"></th>
            <th>1</th>
            <th>2</th>
          </tr>
          <tr>
            <th rowspan="4">DATOS DE PLACA</th>
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
            <th rowspan="3">MEDICIONES VOLTAJE</th>
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
            <th rowspan="3">AMPERAJE</th>
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
    <div class="col"><strong>FIRMA EJECUTOR</strong></div>
    <div class="col"><strong>FIRMA RECIBE</strong></div>
    <div class="col"><strong>SELLO</strong></div>
  </div>
</div>

<!-- **************************************************************** -->
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
