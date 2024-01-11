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
	setLanguage(language = null)
	{
		setTimeout(function()
		{
			const userLanguage = document.getElementById('UserSetting_Language');
			if (userLanguage !== null) { this.language = userLanguage.textContent; }
			document.getElementById('CurrentLanguage').textContent = this.language;
		}, 200);
	}
}