import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

export function createAudioMediaTypeRegExp(types) {
    const regExpSafeNames = types.map(type => type.replace('+', '\\+'));
    return new RegExp(`^audio\\/(${regExpSafeNames.join('|')})$`);
}

export function isHtmlIncluded( dataTransfer ) {
    return Array.from( dataTransfer.types ).includes( 'text/html' ) && dataTransfer.getData( 'text/html' ) !== '';
}

export function fetchLocalAudio( audio ) {
    return new Promise( ( resolve, reject ) => {
        const audioSrc = audio.getAttribute( 'src' );

        // Fetch works asynchronously and so does not block browser UI when processing data.
        fetch( audioSrc )
            .then( resource => resource.blob() )
            .then( blob => {
                const mimeType = getAudioMimeType( blob, audioSrc );
                const ext = mimeType.replace( 'audio/', '' );
                const filename = `audio.${ ext }`;
                const file = new File( [ blob ], filename, { type: mimeType } );

                resolve( file );
            } )
            .catch( reject );
    } );
}

export function isLocalAudio( node ) {
    if ( !node.is( 'element', 'audio' ) || !node.getAttribute( 'src' ) ) {
        return false;
    }

    return node.getAttribute( 'src' ).match( /^data:audio\/\w+;base64,/g ) ||
        node.getAttribute( 'src' ).match( /^blob:/g );
}

function getAudioMimeType( blob, src ) {
    if ( blob.type ) {
        return blob.type;
    } else if ( src.match( /data:(audio\/\w+);base64/ ) ) {
        return src.match( /data:(audio\/\w+);base64/ )[ 1 ].toLowerCase();
    } else {
        // Fallback to 'mp4' as common extension.
        return 'audio/mp3';
    }
}

export function getAudiosFromChangeItem( editor, item ) {
    return Array.from( editor.model.createRangeOn( item ) )
        .filter( value => value.item.is( 'element', 'audio' ) )
        .map( value => value.item );
}


// Audio Utils

function checkSelectionOnObject( selection, schema ) {
	const selectedElement = selection.getSelectedElement();

	return selectedElement && schema.isObject( selectedElement );
}

function isInOtherAudio( selection ) {
	return [ ...selection.focus.getAncestors() ].every( ancestor => !ancestor.is( 'element', 'audio' ) );
}

export function getViewAudioFromWidget( figureView ) {
	const figureChildren = [];

	for ( const figureChild of figureView.getChildren() ) {
		figureChildren.push( figureChild );

		if ( figureChild.is( 'element' ) ) {
			figureChildren.push( ...figureChild.getChildren() );
		}
	}

	return figureChildren.find( viewChild => viewChild.is( 'element', 'audio' ) );
}

export function insertAudio( writer, model, attributes = {} ) {
	console.log("got to the insert audiuo")
	attributes.controls = 'controls';
	const audioElement = writer.createElement( 'audio', attributes );

	const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );

	model.insertContent( audioElement, insertAtSelection );

	if ( audioElement.parent ) {
		writer.setSelection( audioElement, 'on' );
	}
}

function getInsertAudioParent( selection, model ) {
	const insertAt = findOptimalInsertionPosition( selection, model );

	const parent = insertAt.parent;

	if ( parent.isEmpty && !parent.is( 'element', '$root' ) ) {
		return parent.parent;
	}

	return parent;
}

function isAudioAllowedInParent( selection, schema, model ) {
	const parent = getInsertAudioParent( selection, model );

	return schema.checkChild( parent, 'audio' );
}

export function isAudioAllowed( model ) {
	const schema = model.schema;
	const selection = model.document.selection;

	return isAudioAllowedInParent( selection, schema, model ) &&
		!checkSelectionOnObject( selection, schema ) &&
		isInOtherAudio( selection );
}