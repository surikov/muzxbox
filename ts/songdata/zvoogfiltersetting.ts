type ZvoogFilterSetting = {
	filterPlugin: ZvoogFilterPlugin | null
	, parameters: ZvoogParameterData[]
	, kind: string
	, initial: string
	, obverseParameter?: number
};
