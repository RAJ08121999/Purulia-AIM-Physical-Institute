import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { DbService } from '../services/db.service';

@Controller('mvc')
export class MvcController {
  constructor(private readonly db: DbService) {}

  @Get('dashboard')
  getMvcDashboardSummary() {
    const students = this.db.getStudents();
    const batches = this.db.getBatches();
    const events = this.db.getEvents();
    const assessments = this.db.getAssessments();

    return {
      status: 'operational',
      regiment: 'Purulia Aim Physical Institute (PAPI/AIM)',
      founder: 'Havaldar Anup Kumar Mahato (ex-Indian Army)',
      location: 'J.K. College Ground, Purulia, West Bengal',
      mission: 'Free Physical Training for Defence & Police Aspirants of Bengal',
      statistics: {
        totalEnrolledCadets: students.length,
        approvedCadets: students.filter(s => s.admissionStatus === 'APPROVED').length,
        pendingAdmissions: students.filter(s => s.admissionStatus === 'PENDING').length,
        activeBatches: batches.length,
        upcomingEvents: events.length,
        trialsRecorded: assessments.length
      },
      lastSync: new Date().toISOString()
    };
  }

  @Get('cadet-card/:dossierNumber')
  getCadetAdmitCardHtml(@Param('dossierNumber') dossierNumber: string, @Res() res: Response) {
    const cadet = this.db.findStudentById(dossierNumber);
    if (!cadet) {
      throw new NotFoundException(`Cadet with dossier ${dossierNumber} not found`);
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>AIM Official Cadet Provisional Admit Card - ${cadet.dossierNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0B0F0A; color: #F5F7F2; padding: 40px; margin: 0; }
          .card { max-width: 680px; margin: 0 auto; background: #121811; border: 2px solid #F59E0B; border-radius: 12px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
          .header { text-align: center; border-bottom: 2px solid #273623; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: bold; color: #F59E0B; letter-spacing: 2px; text-transform: uppercase; }
          .subtitle { font-size: 13px; color: #9CA3AF; margin-top: 4px; }
          .dossier-badge { display: inline-block; background: #273623; color: #FACC15; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 12px; border: 1px solid #4B6135; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; }
          .item { background: #0B0F0A; padding: 12px; border-radius: 6px; border: 1px solid #1C2618; }
          .label { color: #9CA3AF; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
          .value { font-weight: 600; color: #FFFFFF; }
          .footer { margin-top: 30px; border-top: 1px dashed #4B6135; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .stamp { border: 2px solid #10B981; color: #10B981; padding: 6px 16px; border-radius: 6px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; transform: rotate(-5deg); font-size: 13px; }
          .signature { text-align: right; font-size: 12px; color: #D1D5DB; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="title">PURULIA AIM PHYSICAL INSTITUTE</div>
            <div class="subtitle">FREE DEFENCE PHYSICAL TRAINING ACADEMY | HEAD TRAINER: HAVALDAR ANUP KUMAR MAHATO</div>
            <div class="dossier-badge">DOSSIER NO: ${cadet.dossierNumber}</div>
          </div>
          <div class="grid">
            <div class="item"><div class="label">Cadet Full Name</div><div class="value">${cadet.fullName}</div></div>
            <div class="item"><div class="label">Father's Name</div><div class="value">${cadet.fatherName}</div></div>
            <div class="item"><div class="label">Target Defence Force</div><div class="value">${cadet.targetForce}</div></div>
            <div class="item"><div class="label">Date of Birth / Gender</div><div class="value">${cadet.dob} (${cadet.gender})</div></div>
            <div class="item"><div class="label">PST Height / Weight</div><div class="value">${cadet.heightCm} cm | ${cadet.weightKg} kg</div></div>
            <div class="item"><div class="label">PST Chest Normal / Exp.</div><div class="value">${cadet.chestNormalCm} cm / ${cadet.chestExpandedCm} cm (+${cadet.chestExpansionCm} cm)</div></div>
            <div class="item"><div class="label">Permanent Domicile</div><div class="value">${cadet.villageTown}, ${cadet.policeStation}, ${cadet.domicileDistrict}</div></div>
            <div class="item"><div class="label">Cadet Contact Phone</div><div class="value">+91 ${cadet.phone}</div></div>
          </div>
          <div class="footer">
            <div class="stamp">OFFICIALLY REGISTERED</div>
            <div class="signature">
              <div style="font-weight: bold; color: #F59E0B;">Havaldar Anup Kumar Mahato</div>
              <div style="font-size: 11px; color: #9CA3AF;">Founder & Head Instructor (Ex-Army)</div>
              <div style="font-size: 10px; color: #6B7280;">J.K. College Ground, Purulia</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }
}
