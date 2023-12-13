import codeSVG from '@plone/volto/icons/blog-entry.svg';

import FootnotesBlockView from './Blocks/Footnote/FootnotesBlockView';
import FootnotesBlockEdit from './Blocks/Footnote/FootnotesBlockEdit';
import FootnotesBlockSchema from './Blocks/Footnote/FootnotesBlockSchema';
import { FOOTNOTE } from './constants';
import installFootnoteEditor from './editor';
import SearchWidget from '@eeacms/volto-slate-footnote/editor/MultiSelectSearchWidget';
import { nanoid } from '@plone/volto-slate/utils';
import { v4 as uuid } from 'uuid';
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

  // Some blocks may have multiple slate fields,
  // thus provide these fields per block type in order to lookup for footnotes:
  //
  //      'my-custom-block-type': ['value', 'field1', 'field2']
  //
  config.settings.blocksWithFootnotesSupport = {
    ...(config.settings.blocksWithFootnotesSupport || {}),
    slate: ['value'],
  };

  // config.blocks.blocksConfig.slate.cloneData = (data) => {
  //   return [
  //     uuid(),
  //     {
  //       ...data,
  //       value: [
  //         ...data.value.map((c) => {
  //           return {
  //             ...c,
  //             children: c.children.map((childrenData) => {
  //               return {
  //                 ...childrenData,
  //                 data: { ...childrenData.data, uid: nanoid(5) },
  //               };
  //             }),
  //           };
  //         }),
  //       ],
  //     },
  //   ];
  // };
  console.log(config);
  return config;
}
