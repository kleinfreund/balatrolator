---
name: Bug report
about: Something isn’t working as expected
labels: ['bug']
body:
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe the issue.
    validations:
      required: true
  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: Steps to reproduce
      description: Describe the steps with which you can reproduce the issue.
    validations:
      required: false
  - type: textarea
    id: expected-result
    attributes:
      label: Expected result
      description: Describe what you expected to happen
    validations:
      required: false
  - type: textarea
    id: actual-result
    attributes:
      label: Actual result
      description: Describe what actually happened
    validations:
      required: false
  - type: input
    id: url
    attributes:
      label: Balatrolator URL
      description: If applicable, provide the share URL to your played hand
      placeholder: http://balatrolator.com/?state=D4iM3YFY1AaA3I5TUvU6AGOu+NACZD88EiA2UnAZkQoE58iA6QqM0Gk0g0JvFBYdcwWnhIJxcACxxJ0uQrh1Z8xIvViVuHlJ1wOy1UY0H1QA
    validations:
      required: false
---
