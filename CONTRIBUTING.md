# Contributing to Nano Collective

Thank you for your interest in contributing to the Nano Collective! This guide will help you add yourself to our contributors page if you have contributed to one of our projects.

## Adding Yourself as a Contributor

We welcome all contributors to showcase themselves on our website! Follow these simple steps:

### Step 1: Prepare Your Photo

1. Choose a clear, professional photo of yourself (or an avatar/illustration)
2. **Image specifications:**
   - Format: JPG, PNG, or WebP
   - Recommended size: 400x400px (square)
   - Maximum file size: 500KB
   - The image will be displayed in a circular avatar
3. Name your file clearly (e.g., `jane-doe.jpg`, `johnsmith.png`)

### Step 2: Add Your Photo to the Repository

1. Fork this repository
2. Add your photo to the `/public/contributors/` directory
3. Ensure your filename is lowercase and uses hyphens (e.g., `jane-doe.jpg`)

### Step 3: Add Your Entry to the Contributors Data

1. Open `/lib/contributors.ts`
2. Add your entry to the `CONTRIBUTORS` array in **alphabetical order by first name**
3. Follow this structure:

```typescript
{
  name: "Your Full Name",
  photo: "yourname.jpg",  // filename in /public/contributors/
  github: "yourusername", // your GitHub username (without @)
  website: "https://yourwebsite.com", // optional
  bio: "Brief description of your contributions" // optional
}
```

### Step 4: Example Entry

Here's a complete example:

```typescript
export const CONTRIBUTORS: Contributor[] = [
  {
    name: "Jane Doe",
    photo: "jane-doe.jpg",
    github: "janedoe",
    website: "https://janedoe.com",
    bio: "Full-stack developer passionate about open source AI tools",
  },
  {
    name: "John Smith",
    photo: "johnsmith.png",
    github: "jsmith",
    bio: "Contributor to documentation and UI components",
  },
  // Add your entry here in alphabetical order!
];
```

### Step 5: Submit Your Pull Request

1. Commit your changes with a clear message:
   ```bash
   git add public/contributors/yourname.jpg lib/contributors.ts
   git commit -m "Add [Your Name] to contributors"
   ```
2. Push to your fork
3. Open a pull request to the `main` branch
4. In your PR description, include:
   - Your name
   - A brief note about your contributions (optional)

## Code Style Guidelines

- Use TypeScript for all code files
- Follow the existing code formatting (project uses Prettier/ESLint)
- Keep entries in the CONTRIBUTORS array alphabetically sorted by first name
- Ensure all required fields are filled (`name` and `photo` are required)

## Questions?

If you have any questions or run into issues:

- Open an issue on GitHub
- Join our Discord community (link on the main website)
- Check out the existing entries in `/lib/contributors.ts` for reference

## Other Ways to Contribute

Beyond adding yourself to the contributors page, you can also:

- Report bugs and suggest features via GitHub Issues
- Improve documentation
- Submit code improvements and new features
- Help answer questions in our community

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License with Attribution. See the [LICENSE](LICENSE) file for details.

---

Thank you for being part of the Nano Collective community! 🎉
