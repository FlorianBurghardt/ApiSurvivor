<?php
#region usings
namespace de\fburghardt\ApiSurvivor\Application\Parts;

use de\fburghardt\Library\HTML\Tag\Area\Main;
use de\fburghardt\Library\HTML\Tag\Body;
use de\fburghardt\Library\HTML\Tag\Lists\Ul;

#endregion

class ActiveRequest_Menu
{
	#region properties
	private Body $body;
	private Main $main;
	private Ul $activeReqest;
	#endregion

	#region constructor
	public function __construct(Body $body)
	{
		$this->body = $body;
		$this->main = new Main();
		$this->body->add($this->main);
		$this->setActiveRequestBody();
	}
	#endregion

	#region getter
	#endregion

	#region setter
	private function setActiveRequestBody(): void
	{
		$this->activeReqest = new Ul(
			[
				'id'=>'ActiveList',
				'class'=>'nav nav-tabs'/*,
				'innerContent' =>
				[
					[
						'tag' => 'Li',
						'attributes' =>
						[
							'id' => 'Request1',
							'class' => 'nav-item',
							'innerContent' =>
							[
								[
									'tag' => 'A',
									'attributes' =>
									[
										'id' => 'Request1_A',
										'class' => 'nav-link active',
										'href' => "#",
										'innerContent' =>
										[
											[
												'content' => 'Active'
											]
										]
									]
								]
							]
						]
					],
					[
						'tag' => 'Li',
						'attributes' =>
						[
							'id' => 'Request2',
							'class' => 'nav-item',
							'innerContent' =>
							[
								[
									'tag' => 'A',
									'attributes' =>
									[
										'id' => 'Request2_A',
										'class' => 'nav-link',
										'href' => "#",
										'innerContent' =>
										[
											[
												'content' => 'Link 1'
											]
										]
									]
								]
							]
						]
					]
				]*/
			]
		);
		$this->main->add($this->activeReqest);
	}
	#endregion
}
?>