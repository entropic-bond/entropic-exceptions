
interface LocaleEntries {
	[ key: string | symbol ]: string | LocaleEntries
}
type Localizer = ( a: string ) => string
type ErrorCodeType = string | ( ( localize: Localizer, ...args: string[] ) => string )
export type ErrorCodes = {
	[ keyCode: string ]: ErrorCodeType
}

export class EntropicException<T extends ErrorCodes> extends Error {

	constructor( code: T[keyof T], locale?: LocaleEntries, ...strings: string[] ) {
		super()
		this.localize = this.localize.bind( this )
		this.locale = locale
		
		if ( !code ) {
			this.message = this.localize( 'unknownErrorMessage', 'Unknown error message' )
			return
		}

		if ( typeof code === 'string' ) this.message = this.localize( code )
		else this.message = code( this.localize, ...strings )
	}

	private localize( s: string, alternative?: string ): string {
		const localized = this.locale? this.locale[ s ] : undefined
		if ( !localized || typeof localized !== 'string' ) return alternative ?? s
		return localized
	}

	private locale: LocaleEntries | undefined
}
