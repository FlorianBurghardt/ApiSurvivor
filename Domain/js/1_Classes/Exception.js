/**
 * The specific exception class for the API-Survivor.
 * @extends Error
 * @param {string} message - The error message
 * @param {number} code - The error code
 * @example throw new Exception('An error occurred', 6000);
 * @example Console output: Exception(6000): An error occurred;
 */
class Exception extends Error
{
	constructor(message, code)
	{
		super(message);
		this.code = code;
		this.name = 'Exception(' + code + ')';
	}
}