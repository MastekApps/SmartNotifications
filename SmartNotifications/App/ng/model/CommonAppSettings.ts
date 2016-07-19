﻿/// <reference path="../../../typings/tsd.d.ts" />

namespace SN {
	export class CommonAppSettings {
		version: string;
		licensed: boolean;
		trial: boolean;
		installationDate: Date;
		invalidLicense: boolean;
	}
}