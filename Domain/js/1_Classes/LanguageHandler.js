class LanguageHandler
{
	//#region Constructor
	constructor()
	{
		this.languageMenu = document.getElementById('LanguageMenuList');
		this.languages = language;
		this.language = 'EN';

		this.addLanguageDropdown();
		this.setLanguage();

		// console.log(language);
		// var targetLanguage = 'DE';
		// var lang = [];
		// language.forEach((item) =>
		// {
		// 	if (item.Language == targetLanguage)
		// 	{
		// 		lang[0] = Object.getOwnPropertyNames(item);
		// 		lang[1] = Object.values(item);
		// 	}
		// });
		// console.log(lang);
	}
	//#endregion

	//#region Setter
	addLanguageDropdown()
	{
		this.languages.forEach((item) =>
		{
			const newLanguage = document.createElement('li');
			newLanguage.id = 'Language-' + item.Language;
			newLanguage.classList.add('dropdown-item');
			newLanguage.textContent = item.Language;
			newLanguage.onclick = function () { languageChange(item.Language); };
	
			this.languageMenu.appendChild(newLanguage);
		});
	}
	setLanguage(language = 'EN')
	{
		// ToDo: 
		// Load UserLanguage from Database (by _restoreAllElements) (DBHandler)
		// Get Language from UserSettings DOM Element 'Language'
		let currentLanguage = document.getElementById('Language');
		console.log("Current Language: " + currentLanguage);
		alert(currentLanguage);
		// Compare Language with CurrentLanguage if different: (LanguageHandler)
			// Change all language contents in DOM (LanguageHandler)
			// Set new language to Language & CurrentLanguage in DOM (LanguageHandler)
			// return new language
			// Update Language in database (DBHandler)
		
		this.language = language;
		document.getElementById('CurrentLanguage').textContent = this.language;
	}
}