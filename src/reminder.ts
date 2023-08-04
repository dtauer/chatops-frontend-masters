import { type Handler, schedule } from '@netlify/functions';
import { getNewItems } from './util/notion';
import { blocks, slackApi } from './util/slack';

const postNewNotionItemsToSlack: Handler = async () => {
	const items = await getNewItems();

	await slackApi('chat.postMessage', {
		channel: 'C05LLAW21QR',
		blocks: [
			blocks.section({
				text: [
					'Here are the opinions awaiting judgment:',
					'',
					...items.map(
						(item) => `- ${item.opinion} (spice level: ${item.spiceLevel})`,
					),
					'',
					`See all items <https://notion.com/${process.env.NOTION_DATABASE_ID}|in Notion>.`,
				].join('\n'),
			}),
		],
	});

	return {
		statusCode: 200,
	};
};

// see https://crontab.guru for more info on how this syntax works
export const handler = schedule('* * * * 1', postNewNotionItemsToSlack);