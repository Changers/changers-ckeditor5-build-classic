import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
// Audio Functionality
import AudioEditing from "./audio/audioediting";
import './audio/audio.css';

// Audio Upload Funnctionality
import AudioUploadUI from "./audioupload/audiouploadui";
import AudioUploadEditing from "./audioupload/audiouploadediting";
import AudioUploadProgress from "./audioupload/audiouploadprogress";

class Audio extends Plugin {
    static get requires() {
        return [ AudioEditing, Widget];
    }

    static get pluginName() {
        return 'Audio';
    }
}



class AudioUpload extends Plugin {
    static get requires() {
        return [AudioUploadEditing, AudioUploadUI, AudioUploadProgress];
    }
}

export {
    Audio,
    AudioUpload
};
