import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PackageService } from './package.service';

@Controller('packages')
export class PackageController {
    constructor(private packageService: PackageService) {}

    @Get(':regionId')
    getPackagesByRegion(@Param('regionId') regionId: string) {
        return this.packageService.getPackagesByRegion(regionId);
    }

    @Post()
    createPackage(@Body() body: {name: string; price: number; features: string; regionId: string }) {
        return this.packageService.createPackage(body.name, body.price, body.features, body.regionId);
    }

}
