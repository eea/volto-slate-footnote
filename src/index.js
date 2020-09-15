import codeSVG from '@plone/volto/icons/code.svg';

import FootnotesBlockView from './Blocks/Footnote/FootnotesBlockView';
import FootnotesBlockEdit from './Blocks/Footnote/FootnotesBlockEdit';
import { FOOTNOTE } from './constants';
import installFootnoteEditor from './editor';

/**
 * @summary Called from Volto to configure new or existing Volto block types.
 * @param {object} config The object received from Volto containing the
 * configuration for all the blocks.
 */
export default function install(config) {
  config.blocks.blocksConfig.slateFootnotes = {
    id: 'slateFootnotes',
    title: 'Footnotes list',
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
  };

  config.settings.footnotes = [...(config.settings.footnotes || []), FOOTNOTE];

  config = installFootnoteEditor(config);

  return config;
}
