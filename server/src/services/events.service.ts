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
