import { EntropicException, ErrorCodes } from './entropic-exception'

const errorMessages = {
	a: 'sss',
	b: ( localize, a, b, c )=> `${ localize( 'errorFoundAt' )}: ${ localize( a + b + c ) }}`,
} as const satisfies ErrorCodes


class ConcreteError extends EntropicException<typeof ConcreteError.errorMessages> {
	static errorMessages = {
		d: 'sd'
	} as const satisfies ErrorCodes
}

class AnotherConcreteError extends EntropicException<typeof AnotherConcreteError.errorMessages> {
	static errorMessages = {
		...ConcreteError.errorMessages,
		e: ( localize, a, b ) => `${ localize( 'errorFoundAt' ) }: ${ localize( a + b ) }`,
	} as const satisfies ErrorCodes

	constructor( code: typeof AnotherConcreteError.errorMessages[keyof typeof AnotherConcreteError.errorMessages], ...strings: string[] ) {
		super( code, {
			errorFoundAt: 'Error found at',
			'sss': 'Localized error message',
			'abc': 'Three letters',
			'ab': 'Two letters'
		}, ...strings )
	}
}

describe( 'EntropicException', () => {
	describe.skip( 'Compile time error tests', () => {
		//@ts-expect-error
		const a = { a: 1 } as const satisfies ErrorCodes

		console.log( errorMessages.a )
		console.log( errorMessages.b( ( s ) => s, 'a', 'b', 'c' ) )

		//@ts-expect-error
		console.log( errorMessages.c )

		//@ts-expect-error
		console.log( errorMessages.b( ( s ) => 1, 'a', 6 ) )

		new EntropicException<typeof errorMessages>( 'sss' )
		new EntropicException<typeof errorMessages>( errorMessages.b, undefined, 'a', 'b', 'c' )
		// @ts-expect-error
		new EntropicException<typeof errorMessages>( 'bbb' )
		// @ts-expect-error
		new EntropicException<typeof errorMessages>( errorMessages.b, {}, 1 )

		new ConcreteError( ConcreteError.errorMessages.d )
		new ConcreteError( 'sd' )
		// @ts-expect-error
		new ConcreteError( ConcreteError.errorMessages.a )
		// @ts-expect-error
		new ConcreteError( 'sss' )

		new AnotherConcreteError( AnotherConcreteError.errorMessages.e )
		new AnotherConcreteError( AnotherConcreteError.errorMessages.d )
		new AnotherConcreteError( 'sd' )
		// @ts-expect-error
		new AnotherConcreteError( AnotherConcreteError.errorMessages.a )
		// @ts-expect-error
		new AnotherConcreteError( 'ddd' )
	})

	describe( 'Runtime error tests', () => {

		it( 'should throw an error with a hardcoded string error code', () => {
			expect( () => {
				throw new EntropicException<typeof errorMessages>( 'sss' );
			} ).toThrow( 'sss' );
		})

		it( 'should throw an error with a localized string error code', () => {
			expect( () => {
				throw new EntropicException<typeof errorMessages>( 'sss', { sss: 'Localized error message' } )
			} ).toThrow( 'Localized error message' );
		})

		it( 'should throw an error with a function error code', () => {
			expect( () => {
				throw new EntropicException<typeof errorMessages>( errorMessages.b, { abc: 'Three letters', errorFoundAt: 'Error found at' }, 'a', 'b', 'c' );
			} ).toThrow( 'Error found at: Three letters' );
		})

		it( 'should throw an error with a localized string error code from a derived class', () => {
			expect( () => {
				throw new ConcreteError( ConcreteError.errorMessages.d, { sd: 'Localized error message' } )
			} ).toThrow( 'Localized error message' );
		})

		it( 'should throw an error with a function error code from a derived class with defined locale', () => {
			expect( () => {
				throw new AnotherConcreteError( AnotherConcreteError.errorMessages.e, 'a', 'b' );
			} ).toThrow( 'Error found at: Two letters' );
		})
	})
})