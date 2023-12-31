import { PREFIX } from '$lib/constants';
import { client } from '$lib/util/redis';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handle_server_error } from '$lib/util/handle_server_error';

export const load: PageServerLoad = async ({ request, params }) => {
	try {
		const id = PREFIX.concat(params.id);
		if (!(await client.exists(id))) throw error(404, 'Group not found in database');
		const { '$.h': h, '$.u': u } = await client.json.get(id, { path: ['h', 'u'] });
		return { h, u, id: params.id };
	} catch (e) {
		throw handle_server_error(request, e)
	}
};
