class Request
{
	constructor()
	{
		this.name = undefined;
		this.id = undefined;
		this.requestMethod = undefined;
		this.url = undefined;
		this.headers = [];
		this.params = [];
		this.body = undefined;
	}
	console() { console.log(this); }
}