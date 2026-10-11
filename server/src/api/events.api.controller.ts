import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { EventsService, CreateRsvpDto } from '../services/events.service';

@Controller('events')
export class EventsApiController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Post()
  createEvent(@Body() dto: any) {
    return this.eventsService.createEvent(dto);
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Post('rsvp')
  registerRollCallRsvp(@Body() dto: CreateRsvpDto) {
    return this.eventsService.registerRsvp(dto);
  }

  @Get(':id/rsvps')
  getEventRsvps(@Param('id') id: string) {
    return this.eventsService.getRsvpsForEvent(id);
  }
}
