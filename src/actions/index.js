function updateModelAction(modelName) {
	return {
		type: 'updateModel',
        modelName: modelName,
	};
};

function updateDirAction(dirContent) {
    return {
    	type: 'updateDir',
        dirContent: dirContent,
    };
};

function updateDirDataAction(dirData) {
	return {
		type: 'updateDirData',
		dirData: dirData,
	};
};

function chooseLanguageAction(language) {
	return {
		type: 'chooseLanguage',
		language: language,
	};
};

export {
	updateModelAction,
	updateDirAction,
	updateDirDataAction,
	chooseLanguage,
};
