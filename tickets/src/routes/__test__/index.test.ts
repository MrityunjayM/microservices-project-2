import request from "supertest";
import { format } from "node:util";
import { app } from "../../app";

const createTicket = async (n: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: format("sbjkfae - %d", n),
      price: 30,
    });
};

it("can fetch a list of tickets", async () => {
  await createTicket(1);
  await createTicket(2);
  await createTicket(3);
  await createTicket(4);
  await createTicket(5);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(5);
});
