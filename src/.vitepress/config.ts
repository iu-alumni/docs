import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "IU Alumni Docs",
    description: "Technical and project documentation for the IU Alumni platform",
    base: "/docs/",

    head: [["link", { rel: "icon", href: "/docs/favicon.svg", type: "image/svg+xml" }]],

    appearance: "dark",

    themeConfig: {
      logo: "/logo.svg",
      siteTitle: "IU Alumni Docs",

      nav: [
        { text: "Home", link: "/" },
        { text: "Technical", link: "/technical/overview" },
        { text: "Requirements", link: "/requirements/functional" },
        { text: "Sprints", link: "/sprints/sprint-0/team-meeting" },
        { text: "Tests", link: "/tests/checklist" },
      ],

      sidebar: [
        {
          text: "Technical Documentation",
          collapsed: false,
          items: [
            { text: "System Overview", link: "/technical/overview" },
            { text: "Backend", link: "/technical/backend" },
            { text: "Frontend (Admin Portal)", link: "/technical/frontend" },
            { text: "Mobile App", link: "/technical/mobile" },
            { text: "Infrastructure", link: "/technical/infrastructure" },
          ],
        },
        {
          text: "Requirements",
          collapsed: false,
          items: [
            { text: "Project Goals Overview", link: "/requirements/project-goals" },
            { text: "Functional Requirements", link: "/requirements/functional" },
            { text: "Quality Attributes", link: "/requirements/quality-attributes" },
            { text: "Use Cases & User Stories", link: "/requirements/use-cases" },
          ],
        },
        {
          text: "Metrics & Analytics",
          collapsed: false,
          items: [
            { text: "Metrics & Analytics", link: "/analytics/metrics" },
          ],
        },
        {
          text: "Sprints",
          collapsed: true,
          items: [
            {
              text: "Sprint 1",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-1/client-meeting" },
                { text: "Mentor Meeting", link: "/sprints/sprint-1/mentor-meeting" },
                { text: "Retrospective", link: "/sprints/sprint-1/retrospective" },
                { text: "Team Meeting", link: "/sprints/sprint-1/team-meeting" },
              ],
            },
            {
              text: "Sprint 2",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-2/client-meeting" },
                { text: "Mentor Meeting", link: "/sprints/sprint-2/mentor-meeting" },
                { text: "Sprint Retrospective", link: "/sprints/sprint-2/sprint-retrospective" },
              ],
            },
            {
              text: "Sprint 3",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-3/client-meeting" },
                { text: "Mentor Meeting", link: "/sprints/sprint-3/mentor-meeting" },
              ],
            },
            {
              text: "Sprint 4",
              collapsed: true,
              items: [
                { text: "Client Meeting", link: "/sprints/sprint-4/client-meeting" },
                { text: "Mentor Meeting", link: "/sprints/sprint-4/mentor-meeting" },
                { text: "Team Meeting", link: "/sprints/sprint-4/team-meeting" },
                { text: "Sprint Retrospective", link: "/sprints/sprint-4/sprint-retrospective" },
              ],
            },
            {
              text: "Sprint 5",
              collapsed: true,
              items: [
                { text: "Mentor Meeting", link: "/sprints/sprint-5/mentor-meeting" },
              ],
            },
          ],
        },
        {
          text: "Tests",
          collapsed: false,
          items: [
            { text: "Checklist", link: "/tests/checklist" },
          ],
        },
      ],

      socialLinks: [
        { icon: "github", link: "https://github.com/iu-alumni" },
      ],

      search: {
        provider: "local",
      },

      footer: {
        message: "IU Alumni Platform Documentation",
        copyright: "© 2025 IU Alumni Team",
      },

      editLink: {
        pattern: "https://github.com/iu-alumni/docs/edit/main/src/:path",
        text: "Edit this page on GitHub",
      },
    },

    mermaid: {
      theme: "default",
    },
  })
);
