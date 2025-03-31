import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('regions')
export class RegionController {
    constructor(private regionService: RegionService) {}

    @Get()
    getAllRegions() {
        return this.regionService.getAllRegions();
    }

    @Post()
    createRegion(@Body('name') name: string) {
        return this.regionService.createRegion(name);
    }
}
