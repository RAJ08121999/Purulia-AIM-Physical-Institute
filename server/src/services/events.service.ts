import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from './db.service';
import { EventRsvpEntity } from '../models';

export interface CreateRsvpDto {
  eventId: string;
  cadetName: string;
  phone: string;
  dossierOrAadhaar: string;
  targetForce?: string;
}

@Injectable()
export class EventsService {
  constructor(private readonly db: DbService) {}

  getAllEvents() {
    return this.db.getEvents();
  }

  getEventById(id: string) {
    const event = this.db.findEventById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  createEvent(dto: any) {
    if (!dto.title || !dto.date) {
      throw new BadRequestException('Event Title and Date are required');
    }

    const event = {
      id: dto.id || `EV-${Date.now().toString().slice(-4)}`,
      title: dto.title.trim(),
      type: dto.type || dto.category || 'Physical Trial',
      category: dto.category || dto.type || 'TRIAL',
      date: dto.date,
      time: dto.time || dto.reportingTime || '05:00 AM IST',
      reportingTime: dto.time || dto.reportingTime || '05:00 AM IST',
      venue: dto.venue || dto.location || 'J.K. College Ground, Purulia',
      location: dto.venue || dto.location || 'J.K. College Ground, Purulia',
      targetCadre: dto.targetCadre || 'All Cadets',
      targetWing: dto.targetCadre || 'All Cadets',
      reportingStatus: dto.reportingStatus || 'OPEN',
      guidelines: dto.guidelines || dto.requiredKit || 'Report in uniform with running shoes and water flask.',
      requiredKit: dto.guidelines || dto.requiredKit || 'Report in uniform with running shoes and water flask.',
      slotsLimit: dto.slotsLimit ? Number(dto.slotsLimit) : 100,
      registeredCount: 0,
      isRollCallOpen: true,
      createdAt: new Date().toISOString()
    };

    const saved = this.db.createEvent(event);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'EVENT_NOTIFICATION_CREATED',
      entity: 'Event',
      entityId: saved.id,
      details: `Drill event published: "${saved.title}" for ${saved.targetCadre}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Event notification published successfully',
      event: saved
    };
  }

  deleteEvent(id: string) {
    const existing = this.db.findEventById(id);
    if (!existing) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    this.db.deleteEvent(id);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'EVENT_DELETED',
      entity: 'Event',
      entityId: id,
      details: `Event "${existing.title}" deleted`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Event deleted successfully'
    };
  }

  registerRsvp(dto: CreateRsvpDto) {
    const event = this.db.findEventById(dto.eventId);
    if (!event) {
      throw new NotFoundException(`Event with ID "${dto.eventId}" not found`);
    }

    if (!dto.cadetName || !dto.phone || !dto.dossierOrAadhaar) {
      throw new BadRequestException('Cadet Name, Contact Phone, and Dossier or Aadhaar are required for Roll Call RSVP');
    }

    if (!event.isRollCallOpen) {
      throw new BadRequestException('Roll Call RSVP is closed for this event');
    }

    if (event.registeredCount >= event.slotsLimit) {
      throw new BadRequestException('Cadet slot capacity reached for this training trial');
    }

    const newRsvp: EventRsvpEntity = {
      id: `rsvp-${Date.now()}`,
      eventId: dto.eventId,
      cadetName: dto.cadetName.trim(),
      phone: dto.phone.trim(),
      dossierOrAadhaar: dto.dossierOrAadhaar.trim(),
      targetForce: dto.targetForce || 'Indian Army Agniveer GD',
      confirmed: true,
      createdAt: new Date().toISOString()
    };

    const saved = this.db.createRsvp(newRsvp);

    this.db.createAuditLog({
      id: `audit-${Date.now()}`,
      action: 'EVENT_ROLLCALL_RSVP',
      entity: 'EventRsvp',
      entityId: saved.id,
      details: `Cadet ${saved.cadetName} RSVP confirmed for event: ${event.title}`,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: `Roll Call RSVP Confirmed! Reporting time is ${event.reportingTime}.`,
      rsvp: saved,
      reportingGate: event.location,
      reportingTime: event.reportingTime,
      requiredKit: event.requiredKit
    };
  }

  getRsvpsForEvent(eventId: string) {
    return this.db.getRsvps(eventId);
  }
}
