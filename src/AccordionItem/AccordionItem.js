import AccordionItemEditing from './AccordionItemEditing';
import AccodrionItemUI from './AccordionItemUI';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import "./accordionItem.css";

export default class AccordionItem extends Plugin {
    static get requires() {
        return [ AccordionItemEditing, AccodrionItemUI ];
    }
}