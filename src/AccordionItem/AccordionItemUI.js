import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class AccodrionItemUI extends Plugin {
    init() {
        console.log( 'AccodrionItemUI#init() got called' );

        const editor = this.editor;
        const t = editor.t;

        // This adds the space functionality
        editor.keystrokes.set( 'Space', ( key, stop ) => {
            editor.execute( 'input', { text: '\u00a0' } );
            stop();
        } );

        // The "accordionItem" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'accordionItem', locale => {
            // The state of the button will be bound to the widget command.
            const command = editor.commands.get( 'insertAccordionItem' );

            // The button will be an instance of ButtonView.
            const buttonView = new ButtonView( locale );

            buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                withText: true,
                tooltip: t( 'Accordion Item' ),
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-collapse" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>
              </svg>`
            } );

            // Bind the state of the button to the command.
            buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

            // Execute the command when the button is clicked (executed).
            this.listenTo( buttonView, 'execute', () => editor.execute( 'insertAccordionItem' ) );

            return buttonView;
        } );
    }
}