import type { MetaFunction } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Todo app" },
    {
      name: "Todo system",
      content: "The best Todo app out there give it a try",
    },
  ];
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  console.log("name is coming ", name);

  // Call your Firebase Function
  const response = await fetch("https://submitform-gobx5s7hoq-uc.a.run.app", {
    method: "POST",
    body: JSON.stringify({ task: name }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();
  console.log(result);
  return json(result);
};

export default function Index() {
  const datas = useActionData<typeof action>();

  return (
    <section className=" bg-white h-screen w-screen justify-center flex flex-col flex-1 p-10 gap-16">
      <p className="text-black text-6xl text-center font-bold">
        Task for Today !!!
      </p>
      <Form method="post">
        <div className="w-full flex gap-10 items-center">
          <input
            type="text"
            placeholder="Enter your task"
            aria-label="input section"
            name="name"
            className="p-12 text-xl text-white h-20 rounded-full flex-1"
          />
          <button
            type="submit"
            className="bg-yellow-800 hover:bg-slate-800 h-20 rounded-full text-xl font-bold text-black p-2 w-56 hover:text-white cursor-pointer"
          >
            Send
          </button>
        </div>
      </Form>
      <div className="flex-1 border bg-black rounded-3xl p-12 gap-10 flex flex-col">
        {datas?.map((item) => (
          <Task
            key={item.id}
            data={datas}
            item={item}
            setData={(val: any) => console.log("")}
          />
        ))}
      </div>
    </section>
  );
}

function Task({
  data,
  item,
  setData,
}: {
  data: { status: boolean; task: string }[];
  item: { status: boolean; task: string };
  setData: (val: { status: boolean; task: string }[]) => void;
}) {
  return (
    <div
      className={`flex hover:border-blue-600 hover:border-4 justify-between items-center ${
        item.status ? "bg-green-600" : "bg-white"
      } rounded-full py-3 px-6`}>
      <p className="text-xl font-semibold text-black capitalize ">
        {item.task}
      </p>
      <div className="gap-3 flex">
        <Form method="post">
          <button
            type="button"
            className={`${
              item.status ? "bg-green-700" : "bg-gray-700"
            } hover:bg-gray-800 h-14 rounded-full text-xl font-bold text-white px-6  hover:text-black cursor-pointer`}
            onClick={() => {
              const filtered = data.map((items) => {
                if (items.task === item.task) {
                  return { ...items, status: true };
                } else {
                  return items;
                }
              });
              setData(filtered);
            }}>
            {item.status ? "✔️" : "Mark as done"}
          </button>
        </Form>
        {!item.status && (
          <Form method="delete">
            <button
              type="button"
              className="bg-red-600 hover:bg-red-800 h-14 rounded-full text-xl font-bold text-white p-2 w-24 hover:text-black cursor-pointer"
              onClick={() => {
                const filtered = data.filter(
                  (items) => items.task !== item.task
                );
                setData(filtered);
              }}>
              Delete
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
