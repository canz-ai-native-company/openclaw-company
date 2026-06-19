# ChatKit Widgets Reference

## Overview

Widgets are rich UI components displayed in chat. Return widgets from `respond()` or from tool calls.

## Available Components

```python
from chatkit.widgets import (
    # Layout
    Card, Box, Row, Col, Divider, Spacer,
    # Text
    Text, Title, Caption, Markdown, Badge, Label,
    # Media
    Image, Icon, Chart,
    # Interactive
    Button, Checkbox, Select, DatePicker, Input, Textarea, RadioGroup, Form,
    # Other
    ListViewItem, Transition,
)
```

## Card Component

Primary container for widget content:

```python
from chatkit.widgets import Card, Text, Button

card = Card(
    children=[
        Text(value="Hello, World!", size="lg", weight="bold"),
        Text(value="This is a card widget."),
        Button(label="Click Me", style="primary"),
    ],
    background="surface",
    size="md",
    padding=16,
)
```

### Card Properties

- `children`: List of child components
- `background`: `"surface"`, `"surface-secondary"`, `"surface-tertiary"`, `"surface-elevated"`, or CSS color
- `size`: `"sm"`, `"md"`, `"lg"`, `"full"`
- `padding`: Number (px) or spacing object
- `status`: Optional status header
- `collapsed`: Collapse body after action completes
- `confirm`: Confirmation action button
- `cancel`: Cancel action button
- `asForm`: Treat as HTML form for confirm/cancel
- `theme`: Force `"light"` or `"dark"`

## Text Components

```python
from chatkit.widgets import Text, Title, Caption, Markdown

# Basic text
Text(value="Regular text", size="md")

# Title
Title(value="Section Title", level=2)

# Caption
Caption(value="Small helper text")

# Markdown
Markdown(value="**Bold** and *italic* text with [links](https://example.com)")

# Text with streaming (for live updates)
Text(id="streaming-text", value="", streaming=True)
```

### Text Properties

- `value`: Text content
- `size`: `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`
- `weight`: `"normal"`, `"medium"`, `"semibold"`, `"bold"`
- `color`: Color token or CSS color
- `italic`, `lineThrough`: Boolean styling
- `textAlign`: `"start"`, `"center"`, `"end"`
- `truncate`: Boolean to truncate overflow
- `minLines`, `maxLines`: Line constraints
- `streaming`: Enable streaming text updates (requires `id`)

## Layout Components

```python
from chatkit.widgets import Row, Col, Box, Divider, Spacer

# Horizontal layout
Row(
    children=[Text(value="Left"), Text(value="Right")],
    gap=8,
    align="center",
    justify="space-between",
)

# Vertical layout
Col(
    children=[Text(value="Top"), Text(value="Bottom")],
    gap=8,
)

# Generic box
Box(
    children=[Text(value="Content")],
    padding=16,
    background="surface-secondary",
)

# Divider line
Divider()

# Spacing
Spacer(size=24)
```

## Image Component

```python
from chatkit.widgets import Image

Image(
    src="https://example.com/image.png",
    alt="Description",
    fit="cover",  # "cover", "contain", "fill", "scale-down", "none"
    position="center",  # "top left", "top", "center", "bottom right", etc.
    width=200,
    height=150,
    radius="md",  # Border radius
    frame=True,  # Subtle border
)
```

## Button Component

```python
from chatkit.widgets import Button

# Primary button
Button(
    label="Submit",
    style="primary",
    color="primary",  # "primary", "secondary", "success", "danger", etc.
    onClickAction=ActionConfig(type="submit_form"),
)

# Icon button
Button(
    iconStart=WidgetIcon(name="search"),
    style="secondary",
    uniform=True,  # Square button
)

# Full-width button
Button(
    label="Full Width",
    block=True,
)
```

### Button Properties

- `label`: Button text
- `style`: `"primary"`, `"secondary"`
- `color`: `"primary"`, `"secondary"`, `"info"`, `"success"`, `"caution"`, `"warning"`, `"danger"`
- `variant`: Control variant token
- `size`: Control size
- `iconStart`, `iconEnd`: Icons before/after label
- `pill`: Fully rounded corners
- `uniform`: Equal width/height
- `block`: 100% width
- `disabled`: Disable interactions
- `submit`: Make form submit button
- `onClickAction`: Action to dispatch on click

## Form Components

```python
from chatkit.widgets import Form, Input, Select, Checkbox, RadioGroup, Textarea, DatePicker

Form(
    children=[
        Input(
            name="email",
            label="Email",
            placeholder="you@example.com",
            type="email",
        ),
        Select(
            name="country",
            label="Country",
            options=[
                {"value": "us", "label": "United States"},
                {"value": "uk", "label": "United Kingdom"},
            ],
        ),
        Checkbox(
            name="subscribe",
            label="Subscribe to newsletter",
        ),
        RadioGroup(
            name="plan",
            label="Select Plan",
            options=[
                {"value": "free", "label": "Free"},
                {"value": "pro", "label": "Pro"},
            ],
        ),
        Textarea(
            name="message",
            label="Message",
            rows=4,
        ),
        DatePicker(
            name="date",
            label="Select Date",
        ),
        Button(label="Submit", submit=True),
    ],
)
```

## Returning Widgets

### From respond() directly

```python
async def respond(
    self,
    thread: ThreadMetadata,
    input: UserMessageItem | None,
    context: Any,
) -> AsyncIterator[ThreadStreamEvent]:
    widget = Card(
        children=[
            Text(value="Welcome!", size="lg"),
            Text(value="How can I help you today?"),
        ]
    )
    yield ThreadItemDoneEvent(
        item=WidgetItem(
            id=self.store.generate_item_id("widget", thread, context),
            thread_id=thread.id,
            created_at=datetime.now(),
            widget=widget,
        )
    )
```

### From tool calls

```python
from agents import function_tool
from chatkit.widgets import Card, Text, Image

@function_tool()
async def show_product(ctx: RunContextWrapper[AgentContext], product_id: str) -> None:
    product = await fetch_product(product_id)

    widget = Card(
        children=[
            Image(src=product.image_url, height=200),
            Text(value=product.name, size="lg", weight="bold"),
            Text(value=f"${product.price}"),
            Button(
                label="Add to Cart",
                onClickAction=ActionConfig(
                    type="add_to_cart",
                    payload={"product_id": product_id}
                ),
            ),
        ]
    )

    await ctx.context.stream_widget(widget)
```

## Streaming Widgets

Stream dynamically updating widgets:

```python
from typing import AsyncGenerator
from agents import Runner
from chatkit.widgets import Card, Text, accumulate_text

async def sample_widget(ctx: RunContextWrapper[AgentContext]) -> None:
    description_result = Runner.run_streamed(
        description_agent, "Generate a product description"
    )

    async def widget_generator() -> AsyncGenerator[Widget, None]:
        text_updates = accumulate_text(
            description_result.stream_events(),
            Text(id="description", value="", streaming=True),
        )
        async for text_widget in text_updates:
            yield Card(children=[text_widget])

    await ctx.context.stream_widget(widget_generator())
```

Note: Only `Text` and `Markdown` components with `id` attributes support streaming text updates.

## Chart Component

```python
from chatkit.widgets import Chart

Chart(
    type="bar",  # "bar", "line", "pie", etc.
    data={
        "labels": ["Jan", "Feb", "Mar"],
        "datasets": [
            {
                "label": "Sales",
                "data": [100, 150, 200],
            }
        ]
    },
    options={
        "responsive": True,
    }
)
```

## Badge Component

```python
from chatkit.widgets import Badge

Badge(
    value="New",
    color="success",  # "primary", "secondary", "success", "warning", "danger"
)
```
