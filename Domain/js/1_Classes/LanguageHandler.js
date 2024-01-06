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
	
			this.languageMenu.appendChild(newLanguage);
		});
	}
	setLanguage()
	{
		document.getElementById('CurrentLanguage').textContent = this.language;
	}
}