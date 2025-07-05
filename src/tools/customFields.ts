import axios from 'axios';

export interface ListCustomFieldNamesArgs {
  context?:   'view' | 'edit';
  page?:      number;
  per_page?:  number;
  search?:    string;
  order?:     'asc' | 'desc';
}

export async function getProductCustomFieldNames(args: ListCustomFieldNamesArgs = {}) {
  const res = await axios.get('/products/custom-fields/names', {
    params: {
      context:  args.context ?? 'view',
      page:     args.page    ?? 1,
      per_page: args.per_page ?? 10,
      search:   args.search,
      order:    args.order   ?? 'desc',
    }
  });
  return res.data;
}
