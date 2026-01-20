import { auth } from "@/db/auth";

export const seedAdmin = async () => {
  const { user, token } = await auth.api.signUpEmail({
    body: {
      email: process.env.SEED_USER_EMAIL!,
      name: process.env.SEED_USER_NAME!,
      password: process.env.SEED_USER_PASSWORD!,
    },
  });

  console.log({ user, token });
};

seedAdmin();
