# Footage Organiser

After filming a bunch of vlogs, once a week or so I would do the annoying long process of transferring all the footage from different cameras into their well organised place in my hard drives. Then I would have to clean the cameras hard drives and then mirror everything to my backup hard drive. I was sick of doing all of this. This desktop application automates the entire process.

So this is the footage organiser. The goal is to automate all that annoying boring stuff after you've filmed and before you've started editing.

How it works? Well you install the app, and create some rules which tell the app where to copy from and to, and how to do it. Then the app can automatically follow these rules in the background, or require manual intervention to work. The help section in the app goes into a lot of detail

## Downloading & Installing App

Find the .exe or .dmg file from the latest release and download and install the app as normal.

Note: You may encounter warnings about being an untrusted developer. This is because I don't want to spend money to get the application certified.

Once the app has been installed check out the help section for some explanations of how it works. Try and create a simple rule, get comfortable with what its doing, then setup your rules to automate all the annoying stuff.

## Contributing

This application is fully open source. Pull requests and contributions are welcome!

### Setup

#### Install

```bash
$ pnpm
```

#### Development

```bash
$ pnpm dev
```

#### Production

```bash
$ pnpm start
```

#### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac
```

### Design

This is an electron application with 3 processes:

- Main process is the typical electron application entry point. It doesnt do very much other then start the application and pass messages between the renderer and worker processes.
- Renderer process is the typical electron application renderer process, this is written in react and uses a lot of ShadCN.
- Worker process is spawned by the main process. This is the scheduler which performs the event loop for the application. That is evaluation of rules, then execution of any actions for the rules.

### Logs

I've designed this with what looks to be pretty aggressive logging. This speeds up debugging as all the logs to immediately identify problems are already there. When building for production, these logs are automatically turned off.

Please follow the logging convention.
