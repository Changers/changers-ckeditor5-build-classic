import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import audioUploadIcon from '../../icons/audio.svg';
import {createAudioMediaTypeRegExp} from "./utils";
import FileDialogButtonView from "@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview";

export default class Audiouploadui extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( 'audioUpload', locale => {
            const view = new FileDialogButtonView( locale );
            const command = editor.commands.get('uploadAudio');
            const audioTypes = editor.config.get('audio.upload.types');
            const audioMediaTypesRegExp = createAudioMediaTypeRegExp(audioTypes);

            view.set({
                acceptedType: audioTypes.map(type => `audio/${type}`).join(','),
                allowMultipleFiles: editor.config.get('audio.upload.allowMultipleFiles')
            });

            view.buttonView.set({
                label: t('Upload Audio'),
                icon: audioUploadIcon,
                tooltip: true
            });

            view.buttonView.bind('isEnabled').to(command);

            view.on('done', (evt, files) => {
                const audiosToUpload = Array.from(files);
                console.log(audiosToUpload, "audios to upload")
                if (audiosToUpload.length) {
                    console.log(audiosToUpload, "audios to upload 2")
                    editor.execute('uploadAudio', { files: audiosToUpload });
                }
            });

            return view;
        });
    }
}
