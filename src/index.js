import codeSVG from '@plone/volto/icons/blog-entry.svg';

import FootnotesBlockView from './Blocks/Footnote/FootnotesBlockView';
import FootnotesBlockEdit from './Blocks/Footnote/FootnotesBlockEdit';
import FootnotesBlockSchema from './Blocks/Footnote/FootnotesBlockSchema';
import { FOOTNOTE } from './constants';
import installFootnoteEditor from './editor';
import SearchWidget from '@eeacms/volto-slate-footnote/editor/MultiSelectSearchWidget';

/**
 * @summary Called from Volto to configure new or existing Volto block types.
 * @param {object} config The object received from Volto containing the
 * configuration for all the blocks.
 */
export default function install(config) {
  config.blocks.blocksConfig.slateFootnotes = {
    id: 'slateFootnotes',
    title: 'Footnotes',
    icon: codeSVG,
    group: 'text',
    view: FootnotesBlockView,
    edit: FootnotesBlockEdit,
    schema: FootnotesBlockSchema,
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
  config.widgets.widget.searchInput = SearchWidget;
  config = installFootnoteEditor(config);

  return config;
}
