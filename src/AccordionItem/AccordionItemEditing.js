import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';

class InsertAccordionItemCommand extends Command {
    execute() {
        console.log("Execute")
        this.editor.model.change( writer => {
            // Insert <accordionItem>*</accordionItem> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( createAccordionItem( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'accordionItem' );

        this.isEnabled = allowedIn !== null;
    }
}

function createAccordionItem( writer ) {
    const accordionItem = writer.createElement( 'accordionItem' );
    const accordionItemTitle = writer.createElement( 'accordionItemTitle' );
    const accordionItemDescription = writer.createElement( 'accordionItemDescription' );

    writer.append( accordionItemTitle, accordionItem );
    writer.append( accordionItemDescription, accordionItem );

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'paragraph', accordionItemDescription );

    return accordionItem;
}

export default class AccordionItemEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        console.log( 'AccordionItemEditing#init() got called' );

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'insertAccordionItem', new InsertAccordionItemCommand( this.editor ) );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'accordionItem', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        } );

        schema.register( 'accordionItemTitle', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'accordionItem',

            // Allow content which is allowed in blocks (i.e. text with attributes).
            allowContentOf: '$block'
        } );

        schema.register( 'accordionItemDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'accordionItem',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        } );

        schema.addChildCheck( ( context, childDefinition ) => {
            if ( context.endsWith( 'accordionItemDescription' ) && childDefinition.name == 'accordionItem' ) {
                return false;
            }
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <accordionItem> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'accordionItem',
            view: {
                name: 'details',
                classes: 'accordion-item'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'accordionItem',
            view: {
                name: 'details',
                classes: 'accordion-item'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'accordionItem',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'details', { class: 'accordion-item' } );

                return toWidget( section, viewWriter, { label: 'accordion item widget' } );
            }
        } );

        // <accordionItemTitle> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'accordionItemTitle',
            view: {
                name: 'summary',
                classes: 'accordion-item-title'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'accordionItemTitle',
            view: {
                name: 'summary',
                classes: 'accordion-item-title'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'accordionItemTitle',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const h1 = viewWriter.createEditableElement( 'summary', { class: 'accordion-item-title' } );
                return toWidgetEditable( h1, viewWriter );
            }
        } );

        // <accordionItemDescription> converters
        conversion.for( 'upcast' ).elementToElement( {
            model: 'accordionItemDescription',
            view: {
                name: 'div',
                classes: 'accordion-item-description'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'accordionItemDescription',
            view: {
                name: 'div',
                classes: 'accordion-item-description'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'accordionItemDescription',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'p', { class: 'accordion-item-description' } );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }
}