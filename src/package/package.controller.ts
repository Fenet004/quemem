import { Controller, Get, Param } from '@nestjs/common';
import { PackageService } from './package.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Package')
@Controller('packages')
export class PackageController {
    constructor(private packageService: PackageService) {}

    @Get(':regionId')
    @ApiOperation({ summary: 'Get packages by region ID' })
    @ApiParam({ name: 'regionId', description: 'The Id of the region' })
    @ApiResponse({ status: 200, description: 'List of packages returned successfully' })
    getPackagesByRegion(@Param('regionId') regionId: string) {
        return this.packageService.getPackagesByRegion(regionId);
    }

}
