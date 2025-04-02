import { Controller, Get } from '@nestjs/common';
import { RegionService } from './region.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Region')
@Controller('regions')
export class RegionController {
    constructor(private regionService: RegionService) {}

    @Get()
    @ApiOperation({ summary: 'Get all available regions' })
    @ApiResponse({ status: 200, description: 'List of regions retured successfully' })
    getAllRegions() {
        return this.regionService.getAllRegions();
    }

}
