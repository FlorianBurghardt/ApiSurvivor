<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Lists\Ul;
#endregion

class UserSetting_Menu
{
	#region properties
	private Body $body;
	private Ul $userSettings;
	#endregion

	#region constructor
	public function __construct(Body $body)
	{
		$this->body = $body;
		$this->setUserSettingsBody();
	}
	#endregion

	#region getter
	#endregion

	#region setter
	private function setUserSettingsBody(): void
	{
		$this->userSettings = new Ul(
			[
				'id'=>'UserSettingsList',
				'class'=>'hidden'
			]
		);
		$this->body->add($this->userSettings);
	}
	#endregion
}
?>