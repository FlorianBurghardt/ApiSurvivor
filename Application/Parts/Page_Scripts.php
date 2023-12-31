<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Block\Div;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Head\Script;
#endregion

class Page_Scripts
{
	#region properties
	private Div $scripts;
	#endregion

	#region constructor
	public function __construct(array|string|null $scriptsJSON, Body $body)
	{
		$this->scripts = new Div(['id'=>'ScriptReferences']);
		$this->setScripts($scriptsJSON, $body);
		$body->add($this->scripts);
	}
	#endregion

	#region getter
	public function getScriptContainer(): Div { return $this->scripts; }
	#endregion

	#region setter
	public function addScripts(array|string|null $scriptsJSON): void
	{
		$this->scripts->setScripts($scriptsJSON);
	}

	public function addScriptsByNames(array $scriptFiles): void
	{
		foreach ($scriptFiles as $file)
		{
			$script = new Script(['src' => $file, 'type' => 'text/javascript']);
			$this->scripts->add($script);
		}
	}
	#endregion

	#region private methods
	private function setScripts(array|string|null $scriptsJSON): void
	{
		if (!is_null($scriptsJSON))
		{
			if (is_string($scriptsJSON)) { $scriptsJSON = [$scriptsJSON]; }
			foreach ($scriptsJSON as $script) { $this->scripts->add($script, 'JSON_FILE'); }
		}
	}
	#endregion
}
?>