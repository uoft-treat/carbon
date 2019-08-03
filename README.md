# <img src="https://i.imgur.com/IbGhq1L.png" alt="Carbon" width="100"/> Carbon

Carbon is a real-time RPEL and rendering engine for TREAT widgets.

It magically constructs a TREAT experiment from a XML definition.

#### Intuitive Syntax for UI Definition

```xml
<?xml version="1.0" encoding="UTF-8"?>

<Experiment
    name="My Experiment"
    author="Jun Zheng"
    version="v1.0"
    uuid="a7cfe50c-a261-48e9-b420-71afdf5823d6"
>

    <Canvas>
        <Section display="flex" flex="1">
            <Widget uuid="0af84e12-4c26-4629-bc16-96f560e5e8af" width="100" height="200" />
            <Widget uuid="0af84e12-4c26-4629-bc16-96f560e5e8af" width="10" height="6" />
            <Section display="flex" flex="0.5">
                <Widget uuid="0af84e12-4c26-4629-bc16-96f560e5e8af" width="100" height="200" />
            </Section>
        </Section>
        <Section display="flex" flex="0.5">
            <Widget uuid="0af84e12-4c26-4629-bc16-96f560e5e8af" width="100" height="200" />
        </Section>
    </Canvas>

</Experiment>

```

#### Powerful API for Easy I/O

![](https://i.imgur.com/YIzXolF.png)

## Concepts

### Virtual DOM

Carbon constructs an virtual DOM under-the-hood. The virtual DOM is used to then construct the real DOM in your browser.

### RPEL

Carbon uses Babel to REPL widget scripts. Thus you can use modern syntax with no issues at all.