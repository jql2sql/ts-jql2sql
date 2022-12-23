import dotenv from "dotenv";
dotenv.config();

import app from "../../src/app"
import request from "supertest";
import { db } from '../../src/database';

function arrayEquals(a: number[], b: number[]) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

/** Dummy for connecting db */
it("connecting DB for rest of testcases", async () => {
  await db.connect().then(() => {
    expect(true).toEqual(true);
  })
  .catch(() => {
    expect(true).toEqual(false);
  });
});

/** max-bug-id test, as of now, max Bug ID is less than 300000, we compare rest api response with 290000 */
it("/bugzilla/rest/2/bug/max-bug-id", async () => {
  const response = await request(app)
    .get('/bugzilla/rest/2/bug/max-bug-id')
    .query({api_key: process.env.API_KEY})
  expect(response.statusCode).toBe(200);
  expect(response.body.id > 290000).toEqual(true);
});

it("/bugzilla/rest/2/bug/max-bug-id-error", async () => {
  const response = await request(app)
    .get('/bugzilla/rest/2/bug/max-bug-id-error')
    .query({api_key: process.env.API_KEY})
  expect(response.statusCode).toBe(500);

  console.log(response.body);
});

/** duplicate-of, Bug 8392 has not been resolved by 'DUPLICATE OF'. So, no Bug ID should be responded */
it("/bugzilla/rest/2/bug/8392/duplicate-of No dup-rel", async () => {
  const response = await request(app)
    .get('/bugzilla/rest/2/bug/8392/duplicate-of')
    .query({api_key: process.env.API_KEY})
  expect(response.statusCode).toBe(200);
  const str: string = response.body.id;
  expect(str.length).toBe(0);
});

/** duplicate-of, Bug 298280 is resolved by 'DUPLICATE OF' Bug 298282. So, 298282 should be responded */
it("/bugzilla/rest/2/bug/298280/duplicate-of dup-rel(298282)", async () => {
  const response = await request(app)
    .get('/bugzilla/rest/2/bug/298280/duplicate-of')
    .query({api_key: process.env.API_KEY})
  expect(response.statusCode).toBe(200);
  expect(response.body.id).toBe(298282);
});

/** duplicate-of, Bug 290000 has no duplication relationship, so ids should be [] empty list */
it("/bugzilla/rest/2/bug/290000/duplicate-of-all No dup-rel", async () => {
  const response = await request(app)
    .get('/bugzilla/rest/2/bug/290000/duplicate-of-all')
    .query({api_key: process.env.API_KEY})
  expect(response.statusCode).toBe(200);
  const arr:[] = response.body.ids;
  expect(arr.length).toBe(0);
});

/**
 * [298280, 298281, 298282, 298284] four bugs are related as duplication relationship.
 * so if input is one of four Bug IDs, '[298280, 298281, 298282, 298284]' should be responded.
 */
it("/bugzilla/rest/2/bug/[298280, 298281, 298282, 298284]/duplicate-of-all [298280, 298281, 298282, 298284]",
async () => {
  const res0 = await request(app)
    .get('/bugzilla/rest/2/bug/298280/duplicate-of-all')
    .query({api_key: process.env.API_KEY});
  const res1 = await request(app)
    .get('/bugzilla/rest/2/bug/298281/duplicate-of-all')
    .query({api_key: process.env.API_KEY});
  const res2 = await request(app)
    .get('/bugzilla/rest/2/bug/298282/duplicate-of-all')
    .query({api_key: process.env.API_KEY});
  const res3 = await request(app)
    .get('/bugzilla/rest/2/bug/298284/duplicate-of-all')
    .query({api_key: process.env.API_KEY});

  expect(res0.statusCode).toBe(200);
  expect(res1.statusCode).toBe(200);
  expect(res2.statusCode).toBe(200);
  expect(res3.statusCode).toBe(200);

  const idsAnswer:number[] = [298280, 298281, 298282, 298284];

  expect(arrayEquals(idsAnswer, res0.body.ids)).toEqual(true);
  expect(arrayEquals(res0.body.ids, res1.body.ids)).toEqual(true);
  expect(arrayEquals(res1.body.ids, res2.body.ids)).toEqual(true);
  expect(arrayEquals(res2.body.ids, res3.body.ids)).toEqual(true);
});

/** search/cpid, wrong CPID is given 'cpid-alph1234number'. */
it("/bugzilla/rest/2/bug/search/cpid Wrong CPID cpid-alph1234number", async () => {
  const res = await request(app)
    .get('/bugzilla/rest/2/bug/search/cpid/contain/cpid-alph1234number')
    .query({api_key: process.env.API_KEY});
  expect(res.statusCode).toEqual(400);
  expect(res.body.errors[0].param).toEqual('cpid');
});

/** search/cpid, wrong CPID is given '897001D0-6486-D7C9_x-1700-2BFA673BC25B', but it looks like UUID. */
it("/bugzilla/rest/2/bug/search/cpid Wrong CPID 897001D0-6486-D7C9_x-1700-2BFA673BC25B", async () => {
  const res = await request(app)
    .get('/bugzilla/rest/2/bug/search/cpid/contain/897001D0-6486-D7C9_x-1700-2BFA673BC25B')
    .query({api_key: process.env.API_KEY});
  expect(res.statusCode).toEqual(400);
  expect(res.body.errors[0].param).toEqual('cpid');
  console.log(res.body);
});

/** search/cpid, correct CPID is given '897001D0-6486-D7C9-1700-2BFA673BC25B' */
it("/bugzilla/rest/2/bug/search/cpid Correct CPID 897001D0-6486-D7C9-1700-2BFA673BC25B", async () => {
  const res = await request(app)
    .get('/bugzilla/rest/2/bug/search/cpid/contain/897001D0-6486-D7C9-1700-2BFA673BC25B')
    .query({api_key: process.env.API_KEY});
  expect(res.statusCode).toEqual(200);
  expect(arrayEquals(res.body.ids, [271111,275632])).toEqual(true);
});

/** search/cpid, correct CPID is given 'CPID_897001D0-6486-D7C9-1700-2BFA673BC25B' */
it("/bugzilla/rest/2/bug/search/cpid Correct CPID CPID_897001D0-6486-D7C9-1700-2BFA673BC25B", async () => {
  const res = await request(app)
    .get('/bugzilla/rest/2/bug/search/cpid/contain/CPID_897001D0-6486-D7C9-1700-2BFA673BC25B')
    .query({api_key: process.env.API_KEY});
  expect(res.statusCode).toEqual(200);
  expect(arrayEquals(res.body.ids, [271111,275632])).toEqual(true);
});