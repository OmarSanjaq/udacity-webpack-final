import { handleSubmit } from "../src/client/js/formHandler";

describe("Testing form submission", () => {
    test("handleSubmit should be defined", () => {
        expect(handleSubmit).toBeDefined();
    });
});
