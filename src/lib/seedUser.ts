import { auth } from "@/db/auth";

export const seedUser = async () => {
  const { user, token } = await auth.api.signUpEmail({
    body: {
      email: "test@test.com",
      name: "Test User",
      password: "testPassword123",
    },
  });

  console.log({ user, token });
};

seedUser();
