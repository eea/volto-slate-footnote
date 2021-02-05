import codeSVG from '@plone/volto/icons/blog-entry.svg';

import FootnotesBlockView from './Blocks/Footnote/FootnotesBlockView';
import FootnotesBlockEdit from './Blocks/Footnote/FootnotesBlockEdit';
import { FOOTNOTE } from './constants';
import installFootnoteEditor from './editor';
import { defaultPlaintextSerializerForInlineChildren } from 'volto-slate/editor/render';

/**
 * @summary Called from Volto to configure new or existing Volto block types.
 * @param {object} config The object received from Volto containing the
 * configuration for all the blocks.
 */
export default function install(config) {
  const oldDeserializer =
    config.settings.slate.plaintextSerializers[FOOTNOTE] ||
    defaultPlaintextSerializerForInlineChildren;
  config.settings.slate.plaintextSerializers[FOOTNOTE] = (editor, element) => {
    return (
      oldDeserializer(editor, element) + ' (' + element.data.footnote + ')'
    );
  };

  config.blocks.blocksConfig.slateFootnotes = {
    id: 'slateFootnotes',
    title: 'Footnotes',
    icon: codeSVG,
    group: 'text',
    view: FootnotesBlockView,
    edit: FootnotesBlockEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    autoAdd: false,
  };

  config.settings.footnotes = [...(config.settings.footnotes || []), FOOTNOTE];

  config = installFootnoteEditor(config);

  return config;
}
